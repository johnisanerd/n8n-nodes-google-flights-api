# n8n-nodes-google-flights-api

An [n8n](https://n8n.io/) community node that searches flights and returns structured fare options: airlines, departure and arrival times, duration, stops, travel class, and price. It is backed by the [Google Flights API](https://apify.com/johnvc/Google-Flights-Data-Scraper-Flight-and-Price-Search?fpr=9n7kx3) on [Apify](https://apify.com?fpr=9n7kx3) and bills per result, so there are no subscriptions and no minimums.

[Installation](#installation) · [Credentials](#credentials) · [Operations](#operations) · [Output](#output) · [Example workflows](#example-workflows) · [Pricing](#pricing) · [Resources](#resources)

## What it does

Give the node a route and a date, and it returns one item per flight option with the airline, route, departure and arrival times, duration, number of stops, travel class, flight numbers, and price. It also works as an **AI Agent tool**, so an agent can look up fares on demand.

- One-way, round-trip (add a return date), and multi-passenger searches
- Filter by maximum price, maximum stops, preferred airlines, and basic-economy exclusion
- Localize with currency, language, and country codes
- Choose how much data to return per flight: Simplified, Raw, or Selected Fields

## Installation

Follow the n8n [community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/):

1. In n8n, open **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-google-flights-api` as the npm package name.
4. Agree to the risks of using community nodes, then select **Install**.

After it installs, the **Google Flights** node appears in the nodes panel.

> n8n Cloud only allows verified community nodes. Until this node is verified, install it on a self-hosted n8n instance.

## Credentials

You need a free [Apify account](https://apify.com?fpr=9n7kx3) and an API token.

1. Sign in to the [Apify Console](https://console.apify.com?fpr=9n7kx3).
2. Open **Settings > Integrations** and copy your **Personal API token**.
3. In n8n, create a new **Apify API** credential and paste the token.
4. Use the credential's **Test** button to confirm it works.

The node also supports **Apify OAuth2** if you prefer to connect that way.

## Operations

**Flight > Search** returns flight options for a route and date.

| Parameter | Description |
| --- | --- |
| Departure Airport | Departure airport IATA code, for example `LAX`. Required. |
| Arrival Airport | Arrival airport IATA code, for example `JFK`. Required. |
| Outbound Date | Departure date, `YYYY-MM-DD`. Required. |
| Return Date | Return date, `YYYY-MM-DD`. Leave empty for one-way. |
| Adults / Children / Infants | Passenger counts. |
| Currency | Three-letter currency code. Defaults to `USD`. |
| Language Code / Country Code | Localization, for example `en` and `us`. |
| Maximum Price | Only return fares at or below this. `0` for no limit. |
| Maximum Stops | At most this many stops. `-1` for no limit, `0` for nonstop. |
| Preferred Airlines | Comma separated airline codes. |
| Exclude Basic Economy | Drop basic economy fares. |
| Maximum Pages | How many result pages to fetch. |
| Output | How much data to return: Simplified, Raw, or Selected Fields. |

## Output

Each flight option is returned as its own n8n item. The API returns more than ten fields per flight, so the **Output** parameter lets you choose how much to return:

- **Simplified** (default): a compact object with `airlines`, `price`, `currency`, `route`, `departureTime`, `arrivalTime`, `duration`, `stops`, `travelClass`, `flightNumbers`, `category`, and `bookingToken`. This mode is also used automatically when the node runs as an AI Agent tool, to keep responses small.
- **Raw**: every field the API returns for each flight, using the original field names below.
- **Selected Fields**: pick exactly which fields to include.

### Fields (Raw and Selected Fields)

| Field | Type | Description |
| --- | --- | --- |
| `airlines` | string | Operating airline(s) |
| `airline_logo` | string | Airline logo image URL |
| `price` | number | Total price for the search's passengers |
| `currency` | string | Currency of the price |
| `category` | string | `best` or `other`, as grouped by Google Flights |
| `route` | string | Route summary, for example `LAX-JFK` |
| `departure_airport` | string | Departure airport code |
| `departure_time` | string | Departure date and time |
| `arrival_airport` | string | Arrival airport code |
| `arrival_time` | string | Arrival date and time |
| `stops` | integer | Number of stops |
| `stops_label` | string | Human label, for example `Nonstop` |
| `layover_airports` | string | Layover airport codes, if any |
| `duration` | string | Total duration, for example `5h 36m` |
| `duration_minutes` | integer | Total duration in minutes |
| `travel_class` | string | Cabin, for example `Economy` |
| `flight_numbers` | string | Flight numbers on the itinerary |
| `outbound_date` | string | Outbound date |
| `overnight` | boolean | Whether the itinerary is overnight |
| `often_delayed` | boolean | Whether this flight is often delayed |
| `carbon_emissions_g` | integer | Estimated carbon emissions in grams |
| `booking_token` | string | Token used to fetch booking options |

## Example workflows

### 1. Daily fare watch for a route

1. **Schedule Trigger**: run once a day.
2. **Google Flights**: Departure `LAX`, Arrival `JFK`, your Outbound Date, Output `Simplified`.
3. **Sort**: by `price` ascending; the first item is the cheapest option.
4. **IF** / **Slack**: alert when the lowest `price` drops below your target.

### 2. Compare nonstop options across dates

1. **Manual Trigger** with a list of dates.
2. **Google Flights**: set Maximum Stops to `0` (nonstop only) for each date.
3. **Google Sheets**: append `airlines`, `departureTime`, `duration`, and `price` per date.

### 3. Let an AI Agent answer travel questions

1. **AI Agent** node.
2. Attach **Google Flights** as a tool.
3. Ask "What's the cheapest nonstop from SFO to Tokyo next Friday?" The agent calls the node (in Simplified mode) and answers with live fares.

## Pricing

This node calls the [Google Flights API](https://apify.com/johnvc/Google-Flights-Data-Scraper-Flight-and-Price-Search?fpr=9n7kx3) on Apify, which is billed **pay-per-result**: a small per-search fee (about **$0.03 for a typical one-page search**) plus a fraction of a cent per flight returned, with no subscription and no minimums. Apify also includes a free monthly usage tier that covers typical volumes. See the [Actor page](https://apify.com/johnvc/Google-Flights-Data-Scraper-Flight-and-Price-Search?fpr=9n7kx3) for current rates.

## Resources

- [Google Flights API on Apify](https://apify.com/johnvc/Google-Flights-Data-Scraper-Flight-and-Price-Search?fpr=9n7kx3)
- [npm package](https://www.npmjs.com/package/n8n-nodes-google-flights-api)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Apify n8n integration guide](https://docs.apify.com/platform/integrations/n8n)

## License

[MIT](LICENSE.md)
