# octoherd-script-normalize-package-repository-field

> Remove redundant information from repository, homepage, bugs fields in package.json

[![@latest](https://img.shields.io/npm/v/octoherd-script-normalize-package-repository-field.svg)](https://www.npmjs.com/package/octoherd-script-normalize-package-repository-field)
[![Build Status](https://github.com/gr2m/octoherd-script-normalize-package-repository-field/workflows/Test/badge.svg)](https://github.com/gr2m/octoherd-script-normalize-package-repository-field/actions?query=workflow%3ATest+branch%3Amain)

This script turns

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/octocat/hello-world.git"
  },
  "bugs": {
    "url": "https://github.com/octocat/hello-world/issues"
  },
  "homepage": "https://github.com/octocat/hello-world/#readme"
}
```

into

```json
{
  "repository": "github:octocat/hello-world"
}
```

`"bugs"` and `"homepage"` are derived from the repository if it is hosted on GitHub. Learn more about `package.json`'s [repository](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#repository), [bugs](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#bugs), and [homepage](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#homepage) fields

## Usage

```js
npx octoherd-script-normalize-package-repository-field \
  --octoherd-token 0123456789012345678901234567890123456789 \
  "gr2m/*"
```

The script has no options

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

[ISC](LICENSE.md)
