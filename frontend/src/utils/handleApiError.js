export function handleApiError(error, setError, setFormError) {
  if (!error || !error.response) {
    setError("Неизвестная ошибка");
    return;
  }

  const data = error.response.data;

  if (data?.message) {
    setError(data.message);
    return;
  }

  if (data?.errors && setFormError) {
    setFormError(data.errors);
    return;
  }

  setError("Ошибка запроса");
}
