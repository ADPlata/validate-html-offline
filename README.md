## Installation

```bash
npm install --save html-validate-offline
```

## Usage

```script
const { validateHTML } = require('@adplata/html-validate-offline')
validateHTML('Your HTML code')    # return { status, message }

status: true/false - Boolean
message: Description of validation - String

```

## Repository

https://github.com/adplata/validate-html-offline

## License

[MIT](https://choosealicense.com/licenses/mit/)

## CHANGELOG

1.0.4 : Fixed - Closing styles
1.0.5 : Added repository to README.md
