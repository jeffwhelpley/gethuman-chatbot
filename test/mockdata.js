'use strict'

module.exports = {
  posts: posts,
  companies: companies,
  colors: colors
}

var posts = [
  {
    companyName: "First Company",
    urlID: 'AAAA',
    title: "This is the first Post",
    company: {
      contactMethods: [
        {
          "type":"phone",
          "target":"866-111-2222"
        },
        {
          "type":"email",
          "target":"first@first.com"
        }
      ],
      callback: {
        phone: "866-111-1111"
      }
    },
  },
  {
    companyName: "Second Company",
    urlID: 'BBBB',
    title: "This is the second Post",
    company: {
      contactMethods: [
        {
          "type":"phone",
          "target":"866-222-2222"
        }
      ],
      callback: {
        phone: "866-222-2222"
      }
    },
  }
];

var companies = [
  {
    name: "First Company",
    contactMethods: [
      {
        "type":"phone",
        "target":"866-111-1111"
      },
      {
        "type":"email",
        "target":"first@first.com"
      }
    ],
    callback: {
      phone: "866-111-1111"
    }
  },
  {
    name: "Second Company",
    contactMethods: [
      {
        "type":"phone",
        "target":"866-222-2222"
      }
    ],
    callback: {
      phone: "866-222-2222"
    }
  },

]

var colors = ['#1c4fff', '#e84778', '#ffc229', '#1ae827', '#5389ff'];
