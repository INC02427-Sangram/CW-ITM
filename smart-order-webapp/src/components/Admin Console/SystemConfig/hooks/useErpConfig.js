import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { activateErpSystem, getErpSystems } from "../services/systemConfig.service";
import fnGetUserRoles from "../../../../utility/fnServices/fnGetUserRoles";

export const useErpConfig = (showNotification) => {
  const dispatch = useDispatch();
  const [erpSystems, setErpSystems] = useState([]);
  const [activeErpSystem, setActiveErpSystem] = useState(null);
  const [isLoadingErp, setIsLoadingErp] = useState(false);
  const [showErpRefreshLoader, setShowErpRefreshLoader] = useState(false);

  const fetchErpSystems = useCallback(() => {
    setIsLoadingErp(true);

    getErpSystems(
      (response) => {
        console.log("getAll ERP systems response:", response);

        if (response && Array.isArray(response)) {
          setErpSystems(response);

          const activeSystem = response.find((system) => system.active === true);
          setActiveErpSystem(activeSystem || null);
          showNotification("success", "ERP systems loaded successfully");
        } else {
          console.error("Invalid ERP systems response format");
          showNotification(
            "error",
            "Failed to load ERP systems: Invalid response format"
          );
        }

        setIsLoadingErp(false);
      },
      (error) => {
        console.error("Error fetching ERP systems:", error);
        showNotification("error", "Failed to load ERP systems");
        setIsLoadingErp(false);
      }
    );
  }, [showNotification]);

  const handleErpChange = useCallback(
    (event) => {
      const selectedErpId = event.target.value;
      const selectedErpSystem = erpSystems.find(
        (system) => system.erpSystemId === selectedErpId
      );

      if (!selectedErpSystem) {
        showNotification("error", "Invalid ERP system selected");
        return;
      }

      setIsLoadingErp(true);

      activateErpSystem(
        selectedErpId,
        (response) => {
          console.log("ERP system activation response:", response);

          setErpSystems((prevSystems) =>
            prevSystems.map((system) => ({
              ...system,
              active: system.erpSystemId === selectedErpId,
            }))
          );
          setActiveErpSystem(selectedErpSystem);
          setIsLoadingErp(false);
          setShowErpRefreshLoader(true);

          fnGetUserRoles(
            dispatch,
            () => {
              setShowErpRefreshLoader(false);
              showNotification(
                "success",
                `ERP system updated to ${selectedErpSystem.name}`
              );
            },
            () => {
              setShowErpRefreshLoader(false);
              showNotification("error", "Failed to refresh configuration");
            }
          );
        },
        (error) => {
          console.error("Error updating ERP system:", error);
          showNotification("error", "Failed to update ERP system");
          setIsLoadingErp(false);
        }
      );
    },
    [erpSystems, showNotification, dispatch]
  );

  useEffect(() => {
    fetchErpSystems();
  }, [fetchErpSystems]);

  return {
    erpSystems,
    activeErpSystem,
    isLoadingErp,
    showErpRefreshLoader,
    fetchErpSystems,
    handleErpChange,
  };
};
