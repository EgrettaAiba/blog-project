import { handleApiError } from "./handleApiError";

test("sets default error when error is null", () => {
  const setError = jest.fn();
  const setFormError = jest.fn();

  handleApiError(null, setError, setFormError);

  expect(setError).toHaveBeenCalled();
});

test("handles validation errors", () => {
  const setError = jest.fn();
  const setFormError = jest.fn();

  const error = {
    response: {
      data: {
        errors: {
          email: "Invalid email",
        },
      },
    },
  };

  handleApiError(error, setError, setFormError);

  expect(setFormError).toHaveBeenCalledWith("email", {
    message: "Invalid email",
  });
});
