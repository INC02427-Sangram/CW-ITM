import React, { useMemo, useState, useEffect } from "react";
import { Paper } from "@material-ui/core";
import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import AttachmentIcon from '@mui/icons-material/Attachment';

class EmlParser {
    constructor(eml) {
        this.eml = eml;
    }

    decodeQuotedPrintable(text) {
        return (text || "")
            .replace(/=\r?\n/g, '')
            .replace(/=([0-9A-F]{2})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
    }

    processParts(textBlock, boundary) {
        let textBody = '';
        let htmlBody = '';
        let attachments = [];

        if (!boundary) return { textBody: textBlock, htmlBody, attachments };

        const parts = textBlock.split(new RegExp(`--${boundary}`)).filter(p => p.trim());

        for (const part of parts) {
            if (part.trim() === '--') continue;

            const partSplitMatch = part.match(/\r?\n\r?\n/);
            if (!partSplitMatch) continue;

            const partHeaderIndex = partSplitMatch.index;
            const partHeaders = part.substring(0, partHeaderIndex);
            let partBody = part.substring(partHeaderIndex + partSplitMatch[0].length);

            if (/Content-Type:.*multipart\//i.test(partHeaders)) {
                const subBoundaryMatch = partHeaders.match(/boundary="?([^"]*)"?/);
                if (subBoundaryMatch) {
                    const subBoundary = subBoundaryMatch[1];
                    const subResult = this.processParts(partBody, subBoundary);
                    if (subResult.textBody) textBody = subResult.textBody;
                    if (subResult.htmlBody) htmlBody = subResult.htmlBody;
                    attachments = attachments.concat(subResult.attachments);
                }
                continue;
            }

            const isAttachment = /Content-Disposition:.*attachment/i.test(partHeaders);
            const isQuotedPrintable = /Content-Transfer-Encoding:.*quoted-printable/i.test(partHeaders);
            const isBase64 = /Content-Transfer-Encoding:.*base64/i.test(partHeaders);

            let decodedBody;
            if (isQuotedPrintable) {
                decodedBody = this.decodeQuotedPrintable(partBody.trim());
            } else if (isBase64) {
                decodedBody = atob(partBody.replace(/\s/g, ''));
            } else {
                decodedBody = partBody.trim();
            }

            if (isAttachment) {
                const filenameMatch = partHeaders.match(/filename="?([^"]*)"?/i) || partHeaders.match(/name="?([^"]*)"?/i);
                const contentTypeMatch = partHeaders.match(/Content-Type:\s*([^;]*)/i);
                attachments.push({
                    filename: filenameMatch ? filenameMatch[1] : 'attachment',
                    base64: isBase64 ? partBody.replace(/\s/g, '') : btoa(decodedBody),
                    type: contentTypeMatch ? contentTypeMatch[1].trim() : 'application/octet-stream',
                });
            } else if (/Content-Type:.*text\/html/i.test(partHeaders)) {
                htmlBody = decodedBody;
            } else if (/Content-Type:.*text\/plain/i.test(partHeaders)) {
                textBody = decodedBody;
            }
        }
        return { textBody, htmlBody, attachments };
    }

    parse() {
        try {
            const firstDoubleNewline = this.eml.match(/\r?\n\r?\n/);
            if (!firstDoubleNewline) {
                throw new Error("Invalid EML format: No header/body separator found.");
            }
            const headerSplitIndex = firstDoubleNewline.index;
            const headerBlock = this.eml.substring(0, headerSplitIndex);
            const bodyBlock = this.eml.substring(headerSplitIndex + firstDoubleNewline[0].length);

            const subjectMatch = headerBlock.match(/^Subject: (.*)$/m);
            const fromMatch = headerBlock.match(/^From: (.*)$/m);
            const toMatch = headerBlock.match(/^To: (.*)$/m);
            const dateMatch = headerBlock.match(/^Date: (.*)$/m);

            const boundaryMatch = headerBlock.match(/boundary="?([^"]*)"?/);
            let result = { textBody: '', htmlBody: '', attachments: [] };

            if (boundaryMatch) {
                const boundary = boundaryMatch[1];
                result = this.processParts(bodyBlock, boundary);
            } else {
                result.textBody = bodyBlock;
            }

            const finalBody = result.htmlBody || result.textBody;
            const isHtml = !!result.htmlBody;

            return {
                subject: subjectMatch ? subjectMatch[1].trim() : 'N/A',
                from: { text: fromMatch ? fromMatch[1].trim() : 'N/A' },
                to: { text: toMatch ? toMatch[1].trim() : 'N/A' },
                date: dateMatch ? new Date(dateMatch[1].trim()) : new Date(),
                text: finalBody.trim() || "Could not find a readable version of the email body.",
                isHtml: isHtml,
                attachments: result.attachments,
            };
        } catch (err) {
            console.error("Failed to parse .eml file", err);
            return null;
        }
    }
}

const EmlViewer = ({ base64Data, type }) => {
    const email = useMemo(() => {
        if (!base64Data) {
            return null;
        }
        try {
            const decodedEml = atob(base64Data);
            const parsedEmail = new EmlParser(decodedEml).parse();
            return parsedEmail;
        } catch (err) {
            console.error("Failed to decode or parse .eml file", err);
            return { error: "Error: Could not process the .eml file content." };
        }
    }, [base64Data]);

    const [previewAttachments, setPreviewAttachments] = useState([]);
    const [selectedPreviewId, setSelectedPreviewId] = useState("");
    useEffect(() => {
        if (!email?.attachments?.length) {
            setPreviewAttachments([]);
            setSelectedPreviewId("");
            return;
        }

        const previews = email.attachments
            .filter((att) => {
                const type = (att.type || "").toLowerCase();
                return type === "application/pdf" || type.startsWith("image/");
            })
            .map((att, index) => {
                const type = att.type || "application/octet-stream";
                const byteCharacters = atob(att.base64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type });
                const url = URL.createObjectURL(blob);

                return {
                    id: `${att.filename || "attachment"}-${index}`,
                    filename: att.filename || `attachment-${index + 1}`,
                    type,
                    url,
                };
            });

        setPreviewAttachments(previews);
        setSelectedPreviewId(previews[0]?.id || "");

        return () => {
            previews.forEach((att) => URL.revokeObjectURL(att.url));
        };
    }, [email]);

    if (!email || email.error) {
        return (
            <Box p={3} display="flex" justifyContent="center" alignItems="center" height="100%">
                <Typography color="error">{email ? email.error : "Loading email..."}</Typography>
            </Box>
        );
    }

    const selectedPreview = previewAttachments.find((att) => att.id === selectedPreviewId);
console.log(selectedPreview, email.attachments, previewAttachments, "..............")
    return (
        <Box p={0} bgcolor="#f5f5f5">
            <Paper elevation={2} style={{ padding: '20px' }}>
                <Box sx={{ mb: 2, borderBottom: '1px solid #ddd', pb: 2 }}>
                    <Typography variant="h5">{email.subject}</Typography>
                    <Typography variant="body2"><strong>From:</strong> {email.from.text}</Typography>
                    <Typography variant="body2"><strong>To:</strong> {email.to.text}</Typography>
                    <Typography variant="body2"><strong>Date:</strong> {email.date.toLocaleString()}</Typography>
                </Box>
{/* --- Section to list ALL attachments for download --- */}
                {email.attachments && email.attachments.length > 0 && (
                    <Box mt={1}>
                        <Typography variant="h6" gutterBottom>
                            Downloadable Attachments ({email.attachments.length})
                        </Typography>
                        <List>
                            {email.attachments.map((att, index) => (
                                <ListItem key={index} disablePadding>
                                    <Button
                                        component="a"
                                        href={`data:${att.type};base64,${att.base64}`}
                                        download={att.filename}
                                        variant="outlined"
                                        startIcon={<AttachmentIcon />}
                                        sx={{ textTransform: 'none', justifyContent: 'flex-start', mb: 1 }}
                                    >
                                        {att.filename}
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
                {email.text === "Could not find a readable version of the email body." ? (
                    <Typography color="textSecondary">{email.text}</Typography>
                ) : email.isHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: email.text }} />
                ) : (
                    <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace', fontSize: '14px' }}>
                        {email.text}
                    </Typography>
                )}

                {/* --- Section to preview selected PDF/image attachment --- */}
                {previewAttachments.length > 0 && (
                    <Box mt={4} pt={2} borderTop="1px solid #ddd">
                        <Typography variant="h6" gutterBottom>
                            Attachment Preview
                        </Typography>

                        {type ==="UnprocessedEmlViewer" && (
                            <FormControl fullWidth size="small" sx={{ my: 2 }}>
                                <InputLabel id="attachment-preview-select-label">Select attachment</InputLabel>
                                <Select
                                    labelId="attachment-preview-select-label"
                                    value={selectedPreviewId}
                                    label="Select attachment"
                                onChange={(event) => setSelectedPreviewId(event.target.value)}
                                width={300}
                                sx={{
                                    maxWidth: 400,
                                }}
                            >
                                {previewAttachments.map((att) => (
                                    <MenuItem key={att.id} value={att.id}>
                                        {att.filename}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        )}

                        {selectedPreview?.type.toLowerCase() === "application/pdf" ? (
                            <iframe
                                title={selectedPreview.filename}
                                src={selectedPreview.url}
                                style={{ width: '100%', height: '600px', border: 'none' }}
                            />
                        ) : selectedPreview?.type.toLowerCase().startsWith("image/") ? (
                            <Box
                                component="img"
                                src={selectedPreview.url}
                                alt={selectedPreview.filename}
                                sx={{
                                    display: "block",
                                    maxWidth: "100%",
                                    maxHeight: "600px",
                                    objectFit: "contain",
                                    mx: "auto",
                                }}
                            />
                        ) : null}
                    </Box>
                )}

                {/* --- Section to list ALL attachments for download --- 
                {email.attachments && email.attachments.length > 0 && (
                    <Box mt={4} pt={2} borderTop="1px solid #ddd">
                        <Typography variant="h6" gutterBottom>
                            Downloadable Attachments ({email.attachments.length})
                        </Typography>
                        <List>
                            {email.attachments.map((att, index) => (
                                <ListItem key={index} disablePadding>
                                    <Button
                                        component="a"
                                        href={`data:${att.type};base64,${att.base64}`}
                                        download={att.filename}
                                        variant="outlined"
                                        startIcon={<AttachmentIcon />}
                                        sx={{ textTransform: 'none', justifyContent: 'flex-start', mb: 1 }}
                                    >
                                        {att.filename}
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}*/}
            </Paper>
        </Box>
    );
};

export default EmlViewer;