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

## License

[MIT](https://choosealicense.com/licenses/mit/)

## CHANGELOG

1.0.4 : Fixed - Closing styles
