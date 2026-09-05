export interface SampleDocument {
  id: string;
  title: string;
  filename: string;
  category: string;
  source: string;
  summary: string;
  content: string;
}

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: 'doc_sampling_manual',
    title: 'MoSPI National Sample Survey (NSS) Sampling Methodology & Frame Manual',
    filename: 'NSS_Sampling_Design_Handbook_MoSPI.txt',
    category: 'Sampling & Survey Design',
    source: 'Survey Design & Research Division (SDRD), MoSPI',
    summary: 'Detailed guidelines on Stratified Multi-Stage Sampling, Primary Sampling Units (PSUs), Ultimate Stage Units (USUs), and Sub-sample Replicate balancing in national socio-economic rounds.',
    content: `GOVERNMENT OF INDIA
MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION
SURVEY DESIGN AND RESEARCH DIVISION (SDRD)
TECHNICAL NOTES ON SAMPLING DESIGN FOR SOCIO-ECONOMIC SURVEYS

1. INTRODUCTION & SAMPLING DESIGN
The National Sample Survey (NSS) adopts a stratified multi-stage design. The first-stage units (FSUs) are the census villages (Panchayat wards in Kerala) in the rural sector and Urban Frame Survey (UFS) blocks in the urban sector. The ultimate stage units (USUs) are households in both the sectors. In the case of large villages/blocks requiring sub-division, an intermediate stage of selection involves the formation of hamlet-groups (hg) or sub-blocks (sb).

2. STRATIFICATION PROCEDURE
Each district is normally treated as a basic stratum. In rural areas, if the rural population of a district is large, it is sub-divided into two or more sub-strata by grouping contiguous tehsils/taluks exhibiting similar demographic and agricultural characteristics. In urban areas, strata are formed within each district according to city size classifications:
- Class 1: Million-plus cities (treated as separate strata)
- Class 2: Towns with population between 50,000 and 1,000,000
- Class 3: Towns with population below 50,000

3. SAMPLE ALLOCATION & SELECTION OF FSUs
The total sample FSUs are allocated equally across four sub-rounds of three months each to capture seasonal fluctuations in employment, consumer expenditure, and morbidity.
Selection of FSUs in the rural sector is conducted using Probability Proportional to Size with Replacement (PPSWR), where size represents census village population. In the urban sector, selection is conducted using Simple Random Sampling Without Replacement (SRSWOR).

4. SUB-SAMPLE REPLICATES & ESTIMATION
To ensure unbiased variance estimation, the sample is drawn in the form of two or more independent sub-samples (replicates). Let Y_1 and Y_2 be the estimates of total population parameter derived from Sub-sample 1 and Sub-sample 2 respectively. The combined national estimate Y is given by Y = (Y_1 + Y_2) / 2.
The estimated variance V(Y) of the combined estimate is calculated as:
V(Y) = (Y_1 - Y_2)^2 / 4.
This replicate formulation allows rapid derivation of standard errors and relative standard errors (RSE) for key socio-economic indicators.

5. NON-SAMPLING ERRORS & WEIGHT RECALIBRATION
When selected sample households are unavailable or non-responsive, enumerators are instructed to substitute only according to strict randomized reserve lists. Unadjusted non-response is handled during post-stratification by re-weighting responding units within the same hamlet-group stratum.`,
  },
  {
    id: 'doc_national_accounts',
    title: 'System of National Accounts (SNA 2008) Indian Compilation Guidelines',
    filename: 'SNA_2008_Indian_National_Accounts_Overview.txt',
    category: 'National Accounts',
    source: 'National Accounts Division (NAD), MoSPI',
    summary: 'Methodology for Gross Value Added (GVA) at basic prices, FISIM allocation, MCA-21 database corporate sector estimation, and Gross Fixed Capital Formation (GFCF).',
    content: `GOVERNMENT OF INDIA
NATIONAL ACCOUNTS DIVISION (NAD)
CENTRAL STATISTICS OFFICE, NEW DELHI
SYSTEM OF NATIONAL ACCOUNTS (SNA 2008) INDIAN COMPILATION METHODOLOGY

1. CONCEPTUAL ARCHITECTURE
India adopted the System of National Accounts 2008 (SNA 2008) in the base year 2011-12 revision. The headline measure for economic activity shifted from GDP at factor cost to Gross Value Added (GVA) at basic prices.
The fundamental relationship is defined as:
GDP at market prices = GVA at basic prices + Product Taxes - Product Subsidies.

Basic prices measure the amount receivable by the producer from the purchaser for a unit of a good or service produced, subtracting any tax payable and adding any subsidy receivable as a consequence of its production or sale.

2. CORPORATE SECTOR ESTIMATION VIA MCA-21
Prior to 2011-12, corporate sector performance was extrapolated from sample studies of Reserve Bank of India (RBI). In the current series, comprehensive corporate sector financial statements filed with the Ministry of Corporate Affairs under the MCA-21 e-Governance portal are directly analyzed. Over 600,000 active non-financial corporations are mapped to National Industrial Classification (NIC 2008) 5-digit codes. Value added is compiled through the production approach by deducting intermediate consumption (raw materials, fuel, professional services) from total value of output.

3. FINANCIAL INTERMEDIATION SERVICES INDIRECTLY MEASURED (FISIM)
Financial intermediaries provide services for which they do not charge explicit fees, but generate income through the spread between interest rates paid to depositors and interest rates charged to borrowers. SNA 2008 requires that FISIM be calculated using a reference rate (free of credit risk) and allocated between intermediate consumption of industries and final consumption of households and general government.

4. GROSS FIXED CAPITAL FORMATION (GFCF)
Gross Capital Formation measures net additions of fixed assets consisting of machinery and equipment, dwellings, other buildings and structures, intellectual property products (R&D, computer software, mineral exploration), and cultivated biological resources. In accordance with SNA 2008, Research and Development (R&D) expenditures are capitalized rather than treated as intermediate consumption.`,
  },
  {
    id: 'doc_cpi_manual',
    title: 'Consumer Price Index (CPI) Rural/Urban/Combined Compilation Manual',
    filename: 'CPI_Technical_Manual_Price_Statistics_Division.txt',
    category: 'Price Statistics',
    source: 'Price Statistics Division (PSD), MoSPI',
    summary: 'Laspeyres price index formula, commodity basket selection based on Consumer Expenditure Survey, imputation rules, and geometric mean aggregation.',
    content: `PRICE STATISTICS DIVISION
MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION
TECHNICAL MANUAL ON COMPILATION OF ALL-INDIA CONSUMER PRICE INDEX (CPI)

1. OBJECTIVE AND SCOPE OF CONSUMER PRICE INDEX
The Consumer Price Index (CPI) measures temporal changes in the price level of a fixed basket of goods and services consumed by targeted resident households. MoSPI compiles separate indices for:
- CPI Rural
- CPI Urban
- CPI Combined (National Aggregate)

2. WEIGHTING DIAGRAM & BASKET FORMATION
The weights assigned to commodities and services in the CPI basket are derived from the nationwide Household Consumption Expenditure Survey (HCES) conducted by the National Sample Survey Office. Commodities are classified into six major groups:
Group 1: Food and Beverages (largest weight in Rural index)
Group 2: Pan, Tobacco and Intoxicants
Group 3: Clothing and Footwear
Group 4: Housing (Urban only; Rural housing weight is zero)
Group 5: Fuel and Light
Group 6: Miscellaneous (Education, Health, Transport, Communication, Personal Care)

3. MATHEMATICAL FORMULATION
Aggregation of price relatives is conducted using the modified Laspeyres formula:
I_t = Sum( W_i * (P_it / P_i0) ) / Sum( W_i ) * 100
where W_i represents the expenditure weight of item i in the base period, P_i0 is the base price, and P_it is the price of item i in the current comparison month t.
At the elementary item level within a selected market, the geometric mean of price relatives is computed to reduce sensitivity to extreme outliers.

4. WEB SCRAPING AND ELECTRONIC PRICE REPORTING
Under the modernization initiative, field price collectors submit weekly and monthly quotations using a dedicated mobile application with geo-coordinates. Web-scraping pipelines are utilized for monitoring electronic consumer items and flight/train tariffs.`,
  },
];
