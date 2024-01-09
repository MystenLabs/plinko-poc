"use client";

import React, { useState } from "react";
import { useGetOwnedObjectsGrouppedByPackage } from "@/hooks/useGetOwnedObjectsGrouppedByPackage";
import { OwnedObjectsCarousel } from "./OwnedObjectsCarousel";
import { SuiExplorerLink } from "../general/SuiExplorerLink";
import { OwnedObjectsDisplayRadio } from "./OwnedObjectsDisplayRadio";
import { OwnedObjectsAccordion } from "./OwnedObjectsAccordion";
import { OwnedObjectsTable } from "./OwnedObjectsTable";
import { Spinner } from "../general/Spinner";
import { useAuthentication } from "@/contexts/Authentication";
import { USER_ROLES } from "@/constants/USER_ROLES";

type Display = "carousel" | "table" | "accordion";

export const OwnedObjects = () => {
  const { user, isLoading: isAuthLoading } = useAuthentication();
  const [display, setDisplay] = useState<Display>("table");
  const { grouppedData, isLoading, isError, reFetchData } =
    useGetOwnedObjectsGrouppedByPackage();

  const handleChangeDisplay = (value: string) => {
    setDisplay(value as Display);
  };

  if (user?.role === USER_ROLES.ROLE_4 && !isAuthLoading) {
    return (
      <div className="text-center">
        <div className="font-bold text-lg">Not logged in</div>
      </div>
    );
  }

  if (isAuthLoading || isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <h3>Error</h3>;
  }
  if (!grouppedData || Object.keys(grouppedData).length === 0) {
    return (
      <div className="font-bold text-lg text-center">No owned objects</div>
    );
  }

  const renderList = () => {
    if (display === "carousel") {
      return (
        <div className="flex flex-col space-y-10 w-[100%]">
          {Object.entries(grouppedData).map(([key, value]) => (
            <div className="space-y-5" key={key}>
              <div className="flex space-x-2 items-center font-bold text-xl">
                <div>Package:</div>
                <SuiExplorerLink objectId={key} type="object" />
              </div>
              <OwnedObjectsCarousel key={key} data={value} />
            </div>
          ))}
        </div>
      );
    }

    if (display === "accordion") {
      return <OwnedObjectsAccordion grouppedData={grouppedData} />;
    }

    if (display === "table") {
      return (
        <OwnedObjectsTable
          data={Object.values(grouppedData).flatMap((item) => item)}
        />
      );
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div className="font-bold text-2xl">Owned Objects</div>
        <OwnedObjectsDisplayRadio
          value={display}
          onChange={handleChangeDisplay}
        />
      </div>
      {renderList()}
    </div>
  );
};
