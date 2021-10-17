import java.util.ArrayList;
import java.util.HashMap;
    
    public class Currency {
        private String currencyName;
        private String abbrev;
        private HashMap<String, Double> exchangeRate = new HashMap<String, Double>();

        public Currency(String newName, String newAbbrev) {
            currencyName = newName;
            abbrev = newAbbrev;
        }

        // name getter
        public String getCurrencyName() {
            return currencyName;
        }

        // name setter
        public void setCurrencyName(String newName) {
            currencyName = newName;
        }

        // abbrev getter
        public String getAbbrev() {
            return abbrev;
        }

        // abbrev setter
        public void setAbbrev(String newAbbrev) {
            abbrev = newAbbrev;
        }

        // exchangeRate getter
        public HashMap<String, Double> getExchangeRate() {
            return exchangeRate;
        }
    
        // exchangeRate setter
        public void setExchangeRate(String key, Double value) {
            exchangeRate.put(key, value);
        }

    public static void main(String[] args) {
    Currency name = new Currency("Indian Rupee", "INR");
    System.out.println(name.getCurrencyName());
    }
}