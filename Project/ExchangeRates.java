import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.LocalDate;
import java.util.Map;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class CurrencyConverter {
	static final String SERVICE_URL = "http://apilayer.net/api/live?access_key=81966625cdcf4630269b0f664d94dc0a";
	// Prints results of pattern matches.
	static final boolean DEBUG = false;
	// Performs a live query, or use saved query result read from a file
	static final boolean USE_SAVED_QUERY = false;
	public static void main(String[] args) throws IOException {
		String data;
		if (USE_SAVED_QUERY) {
			// Saved query to reduce API calls.
			String filename = "exchange-rate-2018-03-26.txt";
			System.out.println("Using saved query result in file " + filename);
			data = readFromFile(filename);
		}
		else {
			// Call the web service. Response: JSON string containing exchange rates.
			System.out.println("Calling web service for exchange rates");
			data = queryExchangeRates();
			saveToFile(data, String.format("exchange-rate-%tF.txt", LocalDate.now()) );
		}
		
		if (DEBUG) System.out.println("Service response:");
		if (DEBUG) System.out.println(data);
		
		// Get all exchange rates
		System.out.println("All exchange rates from the service:");
		Map<String,Double> rates = parseRates(data);
		printExchangeRates(rates);
	}
	
	// Print all the exchange rates contained in map.
	private static void printExchangeRates(Map<String,Double> rates) {
		for(String currency: rates.keySet()) {
			System.out.printf("USD-%s = %.6f\n", currency, rates.get(currency));
		}
	}
	
	/**
	 * @param currencyCodes currency codes you want to get rates for.
	 *    If none, then ALL exchange rates retrieved.
	 * @return Body of HTTP response from web service, as String with newlines removed.
	 * @throws IOException if cannot connect to URL, or error reading from URLConnection
	 */
	public static String queryExchangeRates(String ... currencyCodes) throws IOException {
		// Query param for specifying currencies (omit this to get all currencies)
		final String CURRENCY_PARAM = "&currencies=%s";
		
		String urlstring = String.format(SERVICE_URL, "81966625cdcf4630269b0f664d94dc0a");
		// If currencies are specified, join them together and append
		// them to the urlstring as query parameter.
		if (currencyCodes.length > 0) {
			urlstring += String.format(CURRENCY_PARAM, join(currencyCodes));
		}
		URL url = null;
		try {
			url = new URL(urlstring);
		} catch (MalformedURLException ex) {
			System.err.println("Invalid URL: "+urlstring);
			return "";
		}
		// openConnection returns URLConnection. 
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		// If succeeds, will return response code HTTP_OK (200)
		int respcode = conn.getResponseCode();
		if (respcode != HttpURLConnection.HTTP_OK) {
			System.err.println("Got HTTP Response code: "+respcode);
			return "";
		}
		// Read the response into a String.
		BufferedReader reader = new BufferedReader( 
						new InputStreamReader( conn.getInputStream() ) );
		StringBuilder sb = new StringBuilder();
		String line = null;
		while((line=reader.readLine()) != null) sb.append(line);
		reader.close();
		return sb.toString();
	}
	
	/**
	 * Join strings together, separated by comma.
	 * @param strings one or more strings to join. Should be at least 2.
	 * @return input parameters joined together, separated by commas.
	 */
	public static String join(String ...strings) {
		return java.util.Arrays.stream(strings).collect(Collectors.joining(","));
	}
	
	/**
	 * Find the exchange rate for USD to the given currencyCode,
	 * by searching the data string.
	 * 
	 * @param currencyCode the currency code to convert to, such as THB.
	 * @param data exchange rate data.  Expected format - "USDxxx":rate1,"USDyyy":rate2
	 * @return the exchange rate from USD to the given currency, or 0 if not found (or no numeric value)
	 */
	public static double parseRate(String currencyCode, String data) {
		String regex = String.format("\"USD%s\":\\s*(\\d*.\\d+)", currencyCode);
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(data);
		
		if (! matcher.find() ) return 0.0;
		String value = matcher.group(1);
		if (DEBUG) System.out.printf("Found USD%s = %s\n", currencyCode, value);
		try {
			return Double.parseDouble(value);
		} 
		catch(NumberFormatException nfe) {
			return 0.0;
		}
	}
	
	/**
	 * Find and return all exchange rate values in the data String.
	 * Method parses data in the format returned by apilayer.net
	 * 
	 * @param data  the exchange rate data from apilayer.net.   
	 * @return map of exchange rates from USD to other currencies. 
	 */
	public static Map<String,Double> parseRates(String data) {
		String regex = "\"USD([A-Z]{3})\":\\s*(\\d*.\\d+)";
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(data);
		Map<String,Double> rates = new TreeMap<>();
		
		int offset = 0;
		while( matcher.find(offset) ) {
			String code = matcher.group(1);
			String value = matcher.group(2);
			if (DEBUG) System.out.printf("Found USD%s = %s\n", code, value);
			try {
				double rate = Double.parseDouble(value);
				rates.put(code, rate);
			}
			catch (NumberFormatException nfe) {
				System.err.printf("Invalid number in exchange rate: USD%s=%s\n", code,value);
			}
			// move starting point for next match
			offset = matcher.end();
		}
		return rates;
	}

	/**
	 * Save data string to a file.
	 * @param data the string to write or append to file.
	 * @param filename the filename to write to.
	 */
	private static void saveToFile(String data, String filename) {
		final boolean append = false; // append to file or overwrite?
		try {
			FileWriter writer = new FileWriter(filename, append);
			writer.append(data);
			writer.close();
		} catch (IOException e) {
			System.err.println("Could not write data to file "+filename);
		}
	}

	/**
	 * Read data from a file and return it as a String.
	 * @param filename is the filename to read 
	 * @return String containing all data, including newlines. Empty string if no file.
	 */
	private static String readFromFile(String filename) {
		StringBuilder sb = new StringBuilder();
		try {
			FileReader reader = new FileReader(filename);
			BufferedReader breader = new BufferedReader(reader);
			String line = null;
			while((line=breader.readLine()) != null) sb.append(line).append('\n');
			reader.close();
		} catch (IOException e) {
			System.err.println("Could not read file "+filename);
		}
		return sb.toString();
	}
}
