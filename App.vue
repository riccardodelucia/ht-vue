<template>
  <section class="ht-container ht-wrapper ht-layout-stack">
    <h1>HT Vue Components</h1>
    <h2>Input Controls</h2>
    <div>
      <ht-input v-model="inputFieldModel" label="Input field"></ht-input>
      <p>inputFieldModel: {{ inputFieldModel }}</p>
    </div>
    <div>
      <ht-textarea v-model="inputTextareaModel" label="Textarea"></ht-textarea>
      <p>inputTextareaModel: {{ inputTextareaModel }}</p>
    </div>

    <div>
      <ht-search-bar
        v-model="searchModelValue"
        label="Search bar reactive"
        :hints="searchHints"
      ></ht-search-bar>
      <p>searchModelValue: {{ searchModelValue }}</p>
    </div>
    <div>
      <ht-search-bar
        label="Search bar with submit"
        :hints="searchHints"
        @search="onSearchSubmit"
      ></ht-search-bar>
      <p>searchModelValue: {{ searchModelValue }}</p>
    </div>
    <div>
      <ht-checkbox
        v-model="checkboxModelValue"
        label="Checkbox label"
        :true-value="checkboxTrueValue"
        :false-value="checkboxFalseValue"
      ></ht-checkbox>
      <p>checkboxModelValue: {{ checkboxModelValue }}</p>
    </div>

    <div>
      <ht-checkbox
        v-model="checkboxMultipleModelValue"
        name="country"
        value="italy"
        label="Italy"
      ></ht-checkbox>
      <ht-checkbox
        v-model="checkboxMultipleModelValue"
        name="country"
        value="france"
        label="France"
      ></ht-checkbox>

      <p>checkboxMultipleModelValue: {{ checkboxMultipleModelValue }}</p>
    </div>
    <div>
      <ht-toggle-switch
        v-model="toggleSwitchModelValue"
        :true-value="toggleSwitchTrueValue"
        :false-value="toggleSwitchFalseValue"
        label="Toggle Switch label"
      ></ht-toggle-switch>
      <p>toggleSwitchModelValue: {{ toggleSwitchModelValue }}</p>
    </div>
    <div>
      <ht-select
        v-model="selectModelValue"
        :options="selectOptions"
        :option-labels="selectOptionLabels"
      ></ht-select>
      <p>selectModelValue: {{ selectModelValue }}</p>
    </div>
    <div>
      <ht-select
        v-model="multipleSelectModelValue"
        :options="multipleSelectOptions"
        :option-labels="multipleSelectOptionLabels"
      ></ht-select>
      <p>multipleSelectModelValue: {{ multipleSelectModelValue }}</p>
    </div>
    <div>
      <ht-radio-group
        :options="radioOptions"
        :option-labels="radioLabels"
        v-model="radioModelValue"
        name="test"
      ></ht-radio-group>
      <p>radioModelValue: {{ radioModelValue }}</p>
    </div>
    <div>
      <ht-input-file v-model="file" label="File input"></ht-input-file>
      <p>file: {{ file?.name }}</p>
    </div>
    <div>
      <ht-input-file v-model="multipleFiles" label="File input"></ht-input-file>
      <p>multipleFiles: {{ multipleFiles?.map(({ name }) => name) }}</p>
    </div>
    <!--     <div>
      <ht-pagination
        :number-of-pages="numberOfPages"
        v-model:page="currentPage"
        :displayed-pages="displayedPages"
      ></ht-pagination>
      <p>current page: {{ currentPage }}</p>
    </div> -->
    <div>
      <h2>Server side table</h2>
      <ht-table-server
        :active-column-names="activeColumnNames"
        :table-data="tableData"
        :columns="columns"
        row-header="Italy"
        v-model:page="currentPage"
        :available-pages="10"
        :use-sort="false"
        :use-search="true"
        :use-pagination="true"
        @search="
          (value) => {
            console.log('search');
            console.log(value);
          }
        "
        @sort="
          (column) => {
            console.log('sorting');
            console.log(column);
          }
        "
        @page-size="
          (size) => {
            console.log('page-size');
            console.log(size);
          }
        "
      >
        <template v-slot="slotProps">
          <template v-if="slotProps.column.name === 'Action'"
            ><button type="button">Action</button></template
          >
        </template>
      </ht-table-server>
      <h2>Client side table</h2>
      <ht-table-client
        :active-column-names="activeColumnNames"
        :table-data="tableData"
        :columns="columns"
        row-header="Country"
        :use-search="true"
        :use-sort="true"
        :use-pagination="true"
        :displayable-pages="3"
      >
        <template v-slot="slotProps">
          <template v-if="slotProps.column.name === 'Action'"
            ><button type="button">
              Action: {{ slotProps.dataValue }}
            </button></template
          >
        </template>
      </ht-table-client>
      <ht-checkbox
        v-for="column in columns"
        v-model="activeColumnNames"
        name="column-group"
        :value="column.name"
        :label="column.name"
      ></ht-checkbox>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

///////////////////////////////////
// Input Field
const inputFieldModel = ref('');
const inputTextareaModel = ref('');

///////////////////////////////////
// Select
const selectOptions = [1, { key: 2 }];
const selectOptionLabels = ['A', 'B'];
const selectModelValue = ref(undefined);

const multipleSelectOptions = ['A', 'B', { value: 'C' }];
const multipleSelectOptionLabels = ['A', 'B', 'C'];
const multipleSelectModelValue = ref([]);

///////////////////////////////////
// Checkbox
const checkboxTrueValue = true;
const checkboxFalseValue = null;
const checkboxModelValue = ref(checkboxFalseValue);
const checkboxMultipleModelValue = ref([]);

///////////////////////////////////
// Toggle Switch
const toggleSwitchTrueValue = 1;
const toggleSwitchFalseValue = { value: 'false' };
const toggleSwitchModelValue = ref(toggleSwitchTrueValue);

///////////////////////////////////
// Radio Group
const radioOptions = [1, { two: 2 }];
const radioLabels = [1, 2];
const radioModelValue = ref(radioOptions[0]);

///////////////////////////////////
// Input File
const file = ref(null);
const multipleFiles = ref([]);

///////////////////////////////////
// Table

function sortStrings(str1, str2) {
  return str1.localeCompare(str2);
}
const columns = [
  { name: 'Country', sortable: true, sortFn: sortStrings },
  { name: 'Capital' },
  { name: 'Inhabitants (Millions)', sortable: true },
  { name: 'Action', sortable: false, fixed: true },
];

const tableData = [
  ['Germany', 'Berlin', 83.24, 'Germany'],
  ['France', 'Paris', 67.39, 'France'],
  ['Italy', 'Rome', 59.11, 'Italy'],
  ['Spain', 'Madrid', 47.45, 'Spain'],
  ['Poland', 'Warsaw', 37.95, 'Poland'],
  ['Netherlands', 'Amsterdam', 17.28, 'Netherlands'],
  ['Greece', 'Athens', 10.42, 'Greece'],
  ['Portugal', 'Lisbon', 10.33, 'Portugal'],
  ['Sweden', 'Stockholm', 10.52, 'Sweden'],
  ['Austria', 'Vienna', 9.01, 'Austria'],
  ['United States', 'Washington, D.C.', 331.9, 'United States'],
  ['Canada', 'Ottawa', 38.25, 'Canada'],
  ['Mexico', 'Mexico City', 126.01, 'Mexico'],
  ['Brazil', 'Brasilia', 214.33, 'Brazil'],
  ['Argentina', 'Buenos Aires', 45.81, 'Argentina'],
  ['United Kingdom', 'London', 67.84, 'United Kingdom'],
  ['Ireland', 'Dublin', 5.33, 'Ireland'],
  ['Norway', 'Oslo', 5.4, 'Norway'],
  ['Switzerland', 'Bern', 8.74, 'Switzerland'],
  ['Russia', 'Moscow', 143.4, 'Russia'],
  ['China', 'Beijing', 1411.75, 'China'],
  ['India', 'New Delhi', 1406.1, 'India'],
  ['Japan', 'Tokyo', 125.71, 'Japan'],
  ['South Korea', 'Seoul', 51.74, 'South Korea'],
  ['Australia', 'Canberra', 26.4, 'Australia'],
  ['New Zealand', 'Wellington', 5.12, 'New Zealand'],
  ['South Africa', 'Pretoria', 59.39, 'South Africa'],
  ['Egypt', 'Cairo', 109.26, 'Egypt'],
  ['Nigeria', 'Abuja', 223.8, 'Nigeria'],
  ['Kenya', 'Nairobi', 55.61, 'Kenya'],
  ['Turkey', 'Ankara', 85.34, 'Turkey'],
  ['Iran', 'Tehran', 87.92, 'Iran'],
  ['Saudi Arabia', 'Riyadh', 36.33, 'Saudi Arabia'],
  ['Pakistan', 'Islamabad', 240.48, 'Pakistan'],
  ['Bangladesh', 'Dhaka', 169.44, 'Bangladesh'],
  ['Vietnam', 'Hanoi', 100.62, 'Vietnam'],
  ['Thailand', 'Bangkok', 71.89, 'Thailand'],
  ['Indonesia', 'Jakarta', 276.36, 'Indonesia'],
  ['Philippines', 'Manila', 114.05, 'Philippines'],
  ['Malaysia', 'Kuala Lumpur', 34.12, 'Malaysia'],
  ['Singapore', 'Singapore', 5.64, 'Singapore'],
];

const activeColumnNames = ref([
  'Country',
  'Capital',
  'Inhabitants (Millions)',
  'Action',
]);

// Server side table
const currentPage = ref(1);

// client side table
const sortTable = (sortColumn) => {
  const sortColumnIndex = sortColumn.columnIndex;
  const orderMultiplier = sortColumn.sortOrder === 'ascending' ? 1 : -1;

  const sortedData = tableData.value.sort((a, b) => {
    const columnA = a[sortColumnIndex];
    const columnB = b[sortColumnIndex];
    return (columnA - columnB) * orderMultiplier;
  });

  tableData.value = sortedData;
};

///////////////////////////////////
// Search Bar
const searchModelValue = ref('');
const onSearchSubmit = (value) => {
  searchModelValue.value = value;
};

const searchHints = [
  'Afghanistan',
  'Åland Islands',
  'Albania',
  'Algeria',
  'American Samoa',
  'Andorra',
  'Angola',
  'Anguilla',
  'Antarctica',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Aruba',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bermuda',
  'Bhutan',
  'Bolivia (Plurinational State of)',
  'Bonaire, Sint Eustatius and Saba',
  'Bosnia and Herzegovina',
  'Botswana',
  'Bouvet Island',
  'Brazil',
  'British Indian Ocean Territory',
  'Brunei Darussalam',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cayman Islands',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Christmas Island',
  'Cocos (Keeling) Islands',
  'Colombia',
  'Comoros',
  'Congo',
  'Congo, Democratic Republic of the',
  'Cook Islands',
  'Costa Rica',
  "Côte d'Ivoire",
  'Croatia',
  'Cuba',
  'Curaçao',
  'Cyprus',
  'Czechia',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Falkland Islands (Malvinas)',
  'Faroe Islands',
  'Fiji',
  'Finland',
  'France',
  'French Guiana',
  'French Polynesia',
  'French Southern Territories',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Gibraltar',
  'Greece',
  'Greenland',
  'Grenada',
  'Guadeloupe',
  'Guam',
  'Guatemala',
  'Guernsey',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Heard Island and McDonald Islands',
  'Holy See',
  'Honduras',
  'Hong Kong',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran (Islamic Republic of)',
  'Iraq',
  'Ireland',
  'Isle of Man',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jersey',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  "Korea (Democratic People's Republic of)",
  'Korea, Republic of',
  'Kuwait',
  'Kyrgyzstan',
  "Lao People's Democratic Republic",
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Macao',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Martinique',
  'Mauritania',
  'Mauritius',
  'Mayotte',
  'Mexico',
  'Micronesia (Federated States of)',
  'Moldova, Republic of',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Montserrat',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Caledonia',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Niue',
  'Norfolk Island',
  'North Macedonia',
  'Northern Mariana Islands',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine, State of',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Pitcairn',
  'Poland',
  'Portugal',
  'Puerto Rico',
  'Qatar',
  'Réunion',
  'Romania',
  'Russian Federation',
  'Rwanda',
  'Saint Barthélemy',
  'Saint Helena, Ascension and Tristan da Cunha',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Martin (French part)',
  'Saint Pierre and Miquelon',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Sint Maarten (Dutch part)',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Georgia and the South Sandwich Islands',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Svalbard and Jan Mayen',
  'Sweden',
  'Switzerland',
  'Syrian Arab Republic',
  'Taiwan, Province of China',
  'Tajikistan',
  'Tanzania, United Republic of',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tokelau',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Turks and Caicos Islands',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom of Great Britain and Northern Ireland',
  'United States Minor Outlying Islands',
  'United States of America',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Venezuela (Bolivarian Republic of)',
  'Viet Nam',
  'Virgin Islands (British)',
  'Virgin Islands (U.S.)',
  'Wallis and Futuna',
  'Western Sahara',
  'Yemen',
  'Zambia',
  'Zimbabwe',
];
</script>

<style lang="postcss">
section {
  margin-bottom: 20rem;
}

h1 {
  font-size: var(--font-size-8);
}

h2 {
  font-size: var(--font-size-5);
}

h3 {
  font-size: var(--font-size-4);
}

h1,
h2 {
  font-family: var(--font-mono);
}

h1,
h2,
h3 {
  text-transform: uppercase;
  color: var(--ht-text-color-2);
}

.ht-layout-stack {
  --stack-space: 3em;
}
</style>
