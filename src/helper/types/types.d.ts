// Add this to a type declaration file, e.g., `types.d.ts`
import { PageFactory } from "../factories/PageFactory";

declare global {
    namespace NodeJS {
        interface Global {
            pageFactory: PageFactory; // replace PageFactory with the actual type
        }
    }
}

export { };