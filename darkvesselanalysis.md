# Dark Vessel AIS Analysis

While ships are required to broadcast their location through the AIS radar system, they can disable this.
When ships "go dark", they are known as dark vessels and may be performing illicit activities such as illegal fishing.
We analyzed public data of 55,368 dark vessels and identified several locations where vessels frequently shut off their AIS transponders.
In this repo, there are figures and maps from our analysis.
We also analyzed other data, such as the number of hours spent dark.

## Hours spent dark (not broadcasting location via AIS):
mean       100.400299
std        371.332763
min         12.000000
25%         15.586875
50%         23.495278
75%         67.812986
max      17215.947500

In general, ships spent around 4 days dark on average.
However, this is a very skewed distribution.

After removing outliers based on IQR:
count: 47884
mean: 34.08340443107881
std: 29.586341438485736
min: 12.0
25%: 14.974722222222223
50%: 20.29083333333333
75%: 40.90951388888889
max: 146.13916666666665

## Vessel Tonnage:
mean       857.755972
std        711.376427
min         12.000000
25%        276.000000
50%        736.000000
75%       1269.000000
max       9499.000000

