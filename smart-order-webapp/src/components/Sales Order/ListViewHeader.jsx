import { useEffect, useState } from "react";
import { languages } from "../../dataStore/Constants";
import { useDispatch, useSelector } from "react-redux";
import ListViewFilters from "./ListViewFilters";
import "./Style.css";

const ListViewHeader = ({ metaData,filteredDate, setFilteredDate, setSelectedStatusTab }) => {
  // No need for state or toggling if you want the filters always visible
  const userLanguage = useSelector((state) => state.appReducer.userLanguage);
  const dispatch = useDispatch();

  return (
    <>
      <div className="listViewFilters-opened"> 
        <ListViewFilters metaData={metaData} filteredDate={filteredDate} setFilteredDate={setFilteredDate} setSelectedStatusTab={setSelectedStatusTab}/>
      </div>
    </>
  );
};

export default ListViewHeader;
