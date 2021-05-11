export const syncRequestToB64 = (syncRequest) => {
  // Sort the keys in the right order
  const orderedKeysSyncRequest = {
    dateRange: syncRequest.dateRange,
    type: syncRequest.type,
    filter: syncRequest,
  };
  return btoa(JSON.stringify(orderedKeysSyncRequest));
};
