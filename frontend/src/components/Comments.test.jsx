import { render } from "@testing-library/react";
import Comments from "./Comments";

test("Comments renders", () => {
  render(<Comments postId={1} />);
});
