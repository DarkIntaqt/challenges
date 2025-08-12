import { render, screen } from "@testing-library/react";
import Container from "@cgg/components/Container/Container";
import css from "@cgg/components/Container/container.module.scss";

const text = "Hello World";

test("Container renders with default props", () => {
   render(<Container>{text}</Container>);

   const container = screen.getByText(text);
   expect(container).toBeInTheDocument();
   expect(container).toBeVisible();
   expect(container).toHaveClass(css.container);
   expect(container).not.toHaveClass(css.large);
   expect(container).not.toHaveClass(css.small);
   expect(container).not.toHaveClass(css.center);

   expect(container).toHaveTextContent(text);
});

test("Container renders with large prop", () => {
   render(<Container large>{text}</Container>);

   const container = screen.getByText(text);
   expect(container).toBeInTheDocument();
   expect(container).toBeVisible();
   expect(container).toHaveClass(css.container);
   expect(container).toHaveClass(css.large);
   expect(container).not.toHaveClass(css.small);
   expect(container).not.toHaveClass(css.center);

   expect(container).toHaveTextContent(text);
});

test("Container renders with small props", () => {
   render(<Container small>{text}</Container>);

   const container = screen.getByText(text);
   expect(container).toBeInTheDocument();
   expect(container).toBeVisible();
   expect(container).toHaveClass(css.container);
   expect(container).not.toHaveClass(css.large);
   expect(container).toHaveClass(css.small);
   expect(container).not.toHaveClass(css.center);

   expect(container).toHaveTextContent(text);
});

test("Container renders with center props", () => {
   render(<Container center>{text}</Container>);

   const container = screen.getByText(text);
   expect(container).toBeInTheDocument();
   expect(container).toBeVisible();
   expect(container).toHaveClass(css.container);
   expect(container).not.toHaveClass(css.large);
   expect(container).not.toHaveClass(css.small);
   expect(container).toHaveClass(css.center);

   expect(container).toHaveTextContent(text);
});

test("Container crashes with small and large prop", () => {
   expect(() =>
      render(
         <Container large small>
            {text}
         </Container>,
      ),
   ).toThrow();
});

test("Container renders without text", () => {
   const { container } = render(<Container></Container>);

   const section = container.querySelector("section");
   expect(section).toBeInTheDocument();
   expect(section).toHaveTextContent("");
});
