import { Tailwind, Button, Html , Body } from "react-email";
import config from "./tailwind-email.config";

export default function  Email  ()  {
  return (
    <Tailwind
      config={config}
    >
      <Html><Body className="bg-brand">
 <Button
        href="https://example.com"
        className="bg-brand px-3 py-2 font-medium leading-4 text-white"
      >
        Click me
      </Button>
      </Body></Html>
     
    </Tailwind>
  );
};
