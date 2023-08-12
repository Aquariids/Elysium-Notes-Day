import React, { use, useCallback, useEffect, useMemo, useState } from "react";
import List from "./List";
const NotesList = ({ data, body, userId, email }: any) => {
  if (!data) {
    return <List body={body} userId={userId} email={email} />;
  } else {
    return <List body={data} userId={userId} email={email} />;
  }
};

export default NotesList;
