import {Dimensions} from 'react-native';
let c = module.exports;

c.device = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

c.colors = {
  backgroundColor: '#303030',
  darkBackground: '#222222',
  border: '#444444',
  accent: '#c061e8',
};

c.urls = {
  api: 'https://dev.dave6.com/midwife/',
  assets: 'https://assets.dave6.com/',
};

c.t = {
  ms: 1,
  sec: 1000,
  min: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
  week: 1000 * 60 * 60 * 24 * 7,
  month: 1000 * 60 * 60 * 24 * 30,
  year: 1000 * 60 * 60 * 24 * 365,
};

c.months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

c.numberingNames = [
  'Primary',
  'Secondary',
  'Tertiary',
  'Quaternary',
  'Quinary',
  'Senary',
  'Septenary',
  'Octonary',
  'Nonary',
  'Denary',
];

c.randomString = () => Math.random().toString(36).substr(2).toUpperCase();

c.center = {justifyContent: 'center', alignItems: 'center'};

c.titleFont = {fontFamily: 'Coustard'};

c.themes = {
  dark: {
    background: '#161616',
    foreground: '#FFFFFF',
    //modal: '#363636',
    modal: '#161616',
    accent: '#82B983',
    lightText: '#F0F0F0',
    text: '#E0E0E0',
    border: '#555',
  },
  light: {
    background: '#FDFDFD',
    foreground: '#161616',
    modal: '#FFF',
    //modal: '#E0E0E0',
    accent: '#82B983', //accent: '#BD7BFF',
    lightText: '#F0F0F0',
    text: '#161616',
    border: '#DDD',
  },
};

c.notes = [
  {
    id: '113',
    clientId: 'C8Y8R31L99',
    title: 'note 1',
    body: 'asdfasdfasdf',
    time: 1616957870104,
  },
  {
    id: '123',
    clientId: 'C8Y8R31L99',
    title: 'note 2',
    body: 'asdfasdfasdfasdfasdfasdf',
    time: 1615957870104,
  },
  {
    id: '133',
    clientId: 'C8Y8R31L99',
    title: 'note 3',
    body: 'asdfasdfasdfasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdfasdfasdfasdf',
    time: 1616957070104,
  },
  {
    id: '213',
    clientId: 'C8Y8R31L99',
    title: 'note 1',
    body: 'asdfasdfasdf',
    time: 1616977870104,
  },
  {
    id: '323',
    clientId: 'C8Y8R31L99',
    title: 'note 2',
    body: 'asdfasdfasdfasdfasdfasdf',
    time: 1616057870104,
  },
  {
    id: '433',
    clientId: 'C8Y8R31L99',
    title: 'note 3',
    body: 'asdfasdfasdfasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdfasdfasdfasdf',
    time: 1616957870104,
  },
  {
    id: '513',
    clientId: 'C8Y8R31L99',
    title: 'note 1',
    body: 'asdfasdfasdf',
    time: 1616957870104,
  },
  {
    id: '623',
    clientId: 'C8Y8R31L99',
    title: 'note 2',
    body: 'asdfasdfasdfasdfasdfasdf',
    time: 1616957870104,
  },
  {
    id: '733',
    clientId: 'C8Y8R31L99',
    title: 'note 3',
    body: 'asdfasdfasdfasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdfasdfasdfasdf',
    time: 1616957870104,
  },
  {
    id: '143',
    clientId: 'C8Y8RF4L99',
    title: 'note 4',
    body: 'asdfasdfasdfasdfasdfasdf',
    time: 1616957870104,
  },
  {
    id: '153',
    clientId: 'C8Y8RF4L99',
    title: 'note 5',
    body: 'asdfasdfasdf',
    time: 1616957870104,
  },
];

// Clients is for testing purposes
c.clients = [
  {
    id: 'C8Y8R31L99',
    address: {
      city: 'waterloo',
      country: 'CA',
      province: 'on',
      street: '208 12 dupont st w',
    },
    delivered: false,
    dob: 797997969174,
    edd: 1606798800000,
    name: {first: 'David', last: 'Anderson', preferred: 'JD'},
    phones: ['123456789', '5195706511', '654987321'],
    notes: 'This patient is a pregnant person who has not given birth',
    noteArray: [
      {id: '113', title: 'note 1', body: 'asdfasdfasdf', time: 1616957870104},
      {
        id: '123',
        title: 'note 2',
        body: 'asdfasdfasdfasdfasdfasdf',
        time: 1616957870104,
      },
      {
        id: '133',
        title: 'note 3',
        body: 'asdfasdfasdfasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdfasdfasdfasdf',
        time: 1616957870104,
      },
      {
        id: '143',
        title: 'note 4',
        body: 'asdfasdfasdfasdfasdfasdf',
        time: 1616957870104,
      },
      {id: '153', title: 'note 5', body: 'asdfasdfasdf', time: 1616957870104},
    ],
    rh: 'negative',
    gbs: 'positive',
  },
  {
    id: 'C8Y8RF4L99',
    address: {
      city: 'waterloo',
      country: 'CA',
      province: 'on',
      street: '208 12 dupont st w',
    },
    delivered: false,
    dob: 797997969174,
    edd: 1606798800000,
    name: {first: 'Diamond', last: 'Jill', preferred: 'JD'},
    phones: ['123456789', '5195706511', '654987321'],
    notes: 'This patient is a pregnant person who has not given birth',
    rh: 'negative',
  },
  {
    id: 'C8Y8RF4L9U',
    address: {
      city: 'waterloo',
      country: 'CA',
      province: 'on',
      street: '208 12 dupont st w',
    },
    delivered: false,
    dob: 797997969174,
    edd: 1610427600000,
    name: {first: 'Firstname', last: 'Jill', preferred: 'JD'},
    phones: ['123456789', '5195706511', '654987321'],
    notes: 'This patient is a pregnant person who has not given birth',
    rh: 'negative',
  },
  {
    id: 'AFFN9B9YPY1',
    address: {
      city: 'Kitchener',
      country: 'Canada',
      province: 'ontario',
      street: '54 King St NW, unit 1234',
    },
    delivered: false,
    dob: 845825081187,
    edd: 1601524800000,
    name: {first: 'Christie', last: 'cbb', preferred: 'MrsChristie'},
    phones: ['123456789', '5195706511', '654987321'],
    notes: '',
    rh: 'negative',
  },
  {
    id: 'AFFN9B9YPY2',
    address: {
      city: 'Kitchener',
      country: 'Canada',
      province: 'ontario',
      street: '54 King St NW, unit 1234',
    },
    delivered: false,
    dob: 845825081187,
    edd: 1601524800000,
    name: {first: 'Christie', last: 'cab', preferred: 'MrsChristie'},
    phones: ['123456789', '5195706511', '654987321'],
    notes: '',
    rh: 'negative',
  },
  {
    id: 'AFFN9B9YPY3',
    address: {
      city: 'Kitchener',
      country: 'Canada',
      province: 'ontario',
      street: '54 King St NW, unit 1234',
    },
    delivered: false,
    dob: 845825081187,
    edd: 1598932800000,
    name: {first: 'liksfe', last: 'czb', preferred: 'MrsChristie'},
    phones: ['123456789', '5195706511', '654987321'],
    notes: '',
    rh: 'negative',
  },
  {
    id: 'ZB7ZYLYNM31',
    address: {
      city: 'kw',
      country: 'Can',
      province: 'on',
      street: '123 easy ',
    },
    delivered: false,
    dob: 191900148345,
    edd: 1609477200000,
    name: {first: 'Agatha', last: 'the great', preferred: 'ATG'},
    phones: ['123456789', '5195706511', '654987321'],
    notes: `here are some Notes
    with enters
    in them`,
    rh: 'positive',
  },

  {
    id: 'ZB7ZYLYNM32',
    address: {
      city: 'kw',
      country: 'Can',
      province: 'on',
      street: '123 easy ',
    },
    delivered: false,
    dob: 191900148345,
    edd: 1609563600000,
    name: {first: 'asdf', last: 'fdfwef great', preferred: 'ATG'},
    phones: ['123456789', '5195706511', '654987321'],
    notes: `here are some Notes
    with enters
    in them`,
    rh: 'positive',
  },
  {
    id: '3PT5BS51MB',
    address: {
      city: '',
      country: '',
      province: '',
      street: '208  st ',
    },
    delivered: false,
    dob: 1022211292565,
    edd: 1595340922809,
    name: {first: 'Avery', last: 'Quill', preferred: 'Quilliam'},
    phones: ['123456789', '5195706511', '654987321'],
    notes: '',
    rh: 'unknown',
  },
];
