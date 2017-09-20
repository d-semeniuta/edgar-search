# edgar-search

This application collects the corporate filings associated with a specific
company which are found through the Securities and Exchange Commission's service
EDGAR found [here](https://www.sec.gov/edgar/searchedgar/companysearch.html).
Companies may be looked up with their trading symbol (e.g. 'AAPL'). This app
will then display a list of available filings associated with that company and
include a link to the HTML version of that file, such as [this file](https://www.sec.gov/Archives/edgar/data/320193/000162828017004790/a10-qq22017412017.htm)
of a 10-Q Form for Apple.

All necessary dependencies are included in the repository except for [Node.js](https://nodejs.org/en/). To run the app locally,
* Make sure Node.js is installed on your machine. Recent releases may be found
[here](https://nodejs.org/en/download/). This application was developed using
`v6.11.3`.
* Clone the repository into a local folder.
* Run the application from the project folder using the command line command `node server.js`.
* Visit <http://localhost:8000> in a browser on the same machine on which the app
is running to use the app.
