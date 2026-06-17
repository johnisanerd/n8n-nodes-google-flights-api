import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';

/**
 * Build the Apify Actor input from node parameters.
 * Only the real Actor inputs are sent; the Output / Fields parameters shape the
 * data we return, they are not part of the Actor input. Optional fields are only
 * sent when the user provides a value so the Actor keeps its own defaults.
 */
export function buildActorInput(
	context: IExecuteFunctions,
	itemIndex: number,
	defaultInput: Record<string, any>,
): Record<string, any> {
	const input: Record<string, any> = {
		...defaultInput,
		departure_id: context.getNodeParameter('departure_id', itemIndex),
		arrival_id: context.getNodeParameter('arrival_id', itemIndex),
		outbound_date: context.getNodeParameter('outbound_date', itemIndex),
		adults: context.getNodeParameter('adults', itemIndex),
		children: context.getNodeParameter('children', itemIndex),
		infants: context.getNodeParameter('infants', itemIndex),
		currency: context.getNodeParameter('currency', itemIndex),
		hl: context.getNodeParameter('hl', itemIndex),
		gl: context.getNodeParameter('gl', itemIndex),
		exclude_basic: context.getNodeParameter('exclude_basic', itemIndex),
		max_pages: context.getNodeParameter('max_pages', itemIndex),
	};

	const returnDate = context.getNodeParameter('return_date', itemIndex, '') as string;
	const airlines = context.getNodeParameter('airlines', itemIndex, '') as string;
	const maxPrice = context.getNodeParameter('max_price', itemIndex, 0) as number;
	const maxStops = context.getNodeParameter('max_stops', itemIndex, -1) as number;

	if (returnDate) input.return_date = returnDate;
	if (airlines) input.airlines = airlines;
	if (maxPrice > 0) input.max_price = maxPrice;
	if (maxStops >= 0) input.max_stops = maxStops;

	return input;
}

const resourceProperties: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Flight',
				value: 'flight',
			},
		],
		default: 'flight',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['flight'],
			},
		},
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search flights for a route and date',
				description: 'Search flights and fares by route and date, returning one item per flight option',
			},
		],
		default: 'search',
	},
];

const actorProperties: INodeProperties[] = [
	{
		displayName: 'Departure Airport',
		name: 'departure_id',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. LAX',
		description: 'Departure airport IATA code. Multiple codes can be comma-separated.',
		displayOptions: { show: { resource: ['flight'], operation: ['search'] } },
	},
	{
		displayName: 'Arrival Airport',
		name: 'arrival_id',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. JFK',
		description: 'Arrival airport IATA code. Multiple codes can be comma-separated.',
		displayOptions: { show: { resource: ['flight'], operation: ['search'] } },
	},
	{
		displayName: 'Outbound Date',
		name: 'outbound_date',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'YYYY-MM-DD',
		description: 'Departure date in YYYY-MM-DD format',
		displayOptions: { show: { resource: ['flight'], operation: ['search'] } },
	},
	{
		displayName: 'Return Date',
		name: 'return_date',
		type: 'string',
		default: '',
		placeholder: 'YYYY-MM-DD',
		description: 'Return date in YYYY-MM-DD format. Leave empty for a one-way search.',
		displayOptions: { show: { resource: ['flight'], operation: ['search'] } },
	},
	{
		displayName: 'Adults',
		name: 'adults',
		type: 'number',
		default: 1,
		typeOptions: { minValue: 1 },
		description: 'Number of adult passengers',
		displayOptions: { show: { resource: ['flight'], operation: ['search'] } },
	},
	{
		displayName: 'Children',
		name: 'children',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0 },
		description: 'Number of child passengers',
		displayOptions: { show: { resource: ['flight'], operation: ['search'] } },
	},
	{
		displayName: 'Infants',
		name: 'infants',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0 },
		description: 'Number of infant passengers',
		displayOptions: { show: { resource: ['flight'], operation: ['search'] } },
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		default: 'USD',
		placeholder: 'e.g. USD',
		description: 'Three-letter currency code for prices',
		displayOptions: { show: { resource: ['flight'], operation: ['search'] } },
	},
	{
		displayName: 'Language Code',
		name: 'hl',
		type: 'string',
		default: 'en',
		placeholder: 'e.g. en',
		description: 'Two-letter language code for the results',
		displayOptions: { show: { resource: ['flight'], operation: ['search'] } },
	},
	{
		displayName: 'Country Code',
		name: 'gl',
		type: 'string',
		default: 'us',
		placeholder: 'e.g. us',
		description: 'Two-letter country code the search runs from',
		displayOptions: { show: { resource: ['flight'], operation: ['search'] } },
	},
	{
		displayName: 'Maximum Price',
		name: 'max_price',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0 },
		description: 'Only return flights at or below this price. Use 0 for no limit.',
		displayOptions: { show: { resource: ['flight'], operation: ['search'] } },
	},
	{
		displayName: 'Maximum Stops',
		name: 'max_stops',
		type: 'number',
		default: -1,
		typeOptions: { minValue: -1 },
		description: 'Only return flights with at most this many stops. Use -1 for no limit, 0 for nonstop only.',
		displayOptions: { show: { resource: ['flight'], operation: ['search'] } },
	},
	{
		displayName: 'Preferred Airlines',
		name: 'airlines',
		type: 'string',
		default: '',
		placeholder: 'e.g. B6,DL',
		description: 'Comma-separated airline codes to prefer. Leave empty for all airlines.',
		displayOptions: { show: { resource: ['flight'], operation: ['search'] } },
	},
	{
		displayName: 'Exclude Basic Economy',
		name: 'exclude_basic',
		type: 'boolean',
		default: false,
		description: 'Whether to exclude basic economy fares from the results',
		displayOptions: { show: { resource: ['flight'], operation: ['search'] } },
	},
	{
		displayName: 'Maximum Pages',
		name: 'max_pages',
		type: 'number',
		default: 1,
		typeOptions: { minValue: 1 },
		description: 'How many result pages to fetch',
		displayOptions: { show: { resource: ['flight'], operation: ['search'] } },
	},
];

const outputProperties: INodeProperties[] = [
	{
		displayName: 'Output',
		name: 'output',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['flight'], operation: ['search'] } },
		options: [
			{
				name: 'Raw',
				value: 'raw',
				description: 'Return every field the API produces for each flight',
			},
			{
				name: 'Selected Fields',
				value: 'selected',
				description: 'Choose exactly which fields to return',
			},
			{
				name: 'Simplified',
				value: 'simplified',
				description: 'Return a compact set of the most useful flight fields',
			},
		],
		default: 'simplified',
		description: 'How much data to return for each flight',
	},
	{
		displayName: 'Fields to Include',
		name: 'fields',
		type: 'multiOptions',
		displayOptions: {
			show: { resource: ['flight'], operation: ['search'], output: ['selected'] },
		},
		options: [
			{ name: 'Airline Logo', value: 'airline_logo' },
			{ name: 'Airlines', value: 'airlines' },
			{ name: 'Arrival Airport', value: 'arrival_airport' },
			{ name: 'Arrival Time', value: 'arrival_time' },
			{ name: 'Booking Token', value: 'booking_token' },
			{ name: 'Carbon Emissions (G)', value: 'carbon_emissions_g' },
			{ name: 'Category', value: 'category' },
			{ name: 'Currency', value: 'currency' },
			{ name: 'Departure Airport', value: 'departure_airport' },
			{ name: 'Departure Time', value: 'departure_time' },
			{ name: 'Duration', value: 'duration' },
			{ name: 'Duration (Minutes)', value: 'duration_minutes' },
			{ name: 'Flight Numbers', value: 'flight_numbers' },
			{ name: 'Layover Airports', value: 'layover_airports' },
			{ name: 'Often Delayed', value: 'often_delayed' },
			{ name: 'Outbound Date', value: 'outbound_date' },
			{ name: 'Overnight', value: 'overnight' },
			{ name: 'Price', value: 'price' },
			{ name: 'Route', value: 'route' },
			{ name: 'Stops', value: 'stops' },
			{ name: 'Stops Label', value: 'stops_label' },
			{ name: 'Travel Class', value: 'travel_class' },
		],
		default: ['airlines', 'price', 'currency', 'route', 'departure_time', 'arrival_time'],
		description: 'Which fields to return when Output is set to Selected Fields',
	},
];

const authenticationProperties: INodeProperties[] = [
	{
		displayName: 'Authentication',
		name: 'authentication',
		type: 'options',
		options: [
			{
				name: 'API Key',
				value: 'apifyApi',
			},
			{
				name: 'OAuth2',
				value: 'apifyOAuth2Api',
			},
		],
		default: 'apifyApi',
		description: 'Choose which authentication method to use',
	},
];

export const properties: INodeProperties[] = [
	...resourceProperties,
	...actorProperties,
	...outputProperties,
	...authenticationProperties,
];
