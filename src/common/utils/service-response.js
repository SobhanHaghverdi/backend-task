const success = (data) => {
  return { success: true, data };
};

const error = (message, data = undefined) => {
  const response = { success: false, message };
  if (data) response.data = data;

  return response;
};

export { success, error };
