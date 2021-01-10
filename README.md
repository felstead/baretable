# Baretable

Baretable is a set of libraries for hosting simple no-code/low-code web applications specifically for reading and exploring an online data source like a database.  Designed specifically for low-to-zero cost serverless hosting.

It consists of:
- `baretable-engine` - the (deliberately bare) API endpoint for handling project configuration, data source querying and authentication
- `baretable-ui` - the UI layer to interface with the engine, a Svelte.js web application

## Philosophy / Use-Case

I built baretable to scratch a very specific set of itches - more details on these below:
1. Allow non-technical users views into a subset of data in our analytics database for various use-cases (customer support, debugging, community enforcement, etc)
2. Make it dead-simple to extend said views
3. Make it essentially free-to-host through various free-tier serverless cloud compute services
4. Support centralized single-signon (specifically google auth)
5. Support versioning and version control
6. Make it Open Source

## Installation

## Usage

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)