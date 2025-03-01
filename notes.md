## Using TypeScript with Jest

if you create a test.ts file and try to use ESM then you will get an error when running tests

It will say cannot use import statement outside of module, even when putting in "type": module in package.json

Using type module or mjs would only work for js files and not typescript files

The solution is to add
npm i -D @types/jest ts-jest

Then create a config file for it
npx ts-jest config:init

This would create a jest.config.js file so we would technically need to add type module to package.json
then it would work

But what if we wanted jest.config.ts?
we need to do
npm i -D ts-node

also make sure you have a ts.config.json and add
{
    "compilerOptions": {
        "esModuleInterop": true
    }
}