const extractMaterialFromData = (data) => {
  if (!Array.isArray(data)) return [];
  return data.flatMap((row) =>
    Array.isArray(row?.material) ? row.material : [],
  );
};

export { extractMaterialFromData };
