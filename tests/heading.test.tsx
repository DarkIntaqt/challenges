import { render, screen } from "@testing-library/react";
import Heading from "@cgg/components/Heading/Heading";
import css from "@cgg/components/Heading/heading.module.scss";

const text = "Hello World";

test("Heading renders without props", () => {
   render(<Heading>{text}</Heading>);

   const heading = screen.getByText(text);
   expect(heading).toBeInTheDocument();
   expect(heading).toBeVisible();
   expect(heading).toHaveClass(css.heading);
   expect(heading.tagName).toBe("H1");
   expect(heading).toHaveTextContent(text);
});

const className = "test-classname";
test("Heading applies custom classname", () => {
   render(<Heading className={className}>{text}</Heading>);

   const heading = screen.getByText(text);
   expect(heading).toBeInTheDocument();
   expect(heading).toBeVisible();
   expect(heading).toHaveClass(css.heading);
   expect(heading).toHaveClass(className);
   expect(heading.tagName).toBe("H1");
   expect(heading).toHaveTextContent(text);
});

test("Heading has levels", () => {
   for (let i = 1; i <= 6; i++) {
      // @ts-expect-error
      render(<Heading level={i}>{i}</Heading>);
      const heading = screen.getByText(i);
      expect(heading.tagName).toBe("H" + i);
   }
});
