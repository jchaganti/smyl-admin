export  const users = [
  {
    'firstName': 'Janaki',
    'lastName': 'Chaganti',
    'email': 'jchaganti@gmail.com',
    'role': 'CURATOR'
  },
  {
    'firstName': 'Gita',
    'lastName': 'Chaganti',
    'email': 'gchaganti@gmail.com',
    'role': 'PAYMENT_MANAGER'
  },
  {
    'firstName': 'Shruthi',
    'lastName': 'Chaganti',
    'email': 'schaganti@gmail.com',
    'role': 'CURATOR'
  },
  {
    'firstName': 'Nalin Aditya',
    'lastName': 'Chaganti',
    'email': 'nalin.aditya@gmail.com',
    'role': 'PAYMENT_MANAGER'
  },
  {
    'firstName': 'Sesha',
    'lastName': 'Chaganti',
    'email': 'sesha@gmail.com',
    'role': 'CURATOR'
  },
  {
    'firstName': 'Sai',
    'lastName': 'Konanki',
    'email': 'sai@gmail.com',
    'role': 'CURATOR'
  },
  {
    'firstName': 'Sundari',
    'lastName': 'Palaparthi',
    'email': 'sundari@gmail.com',
    'role': 'CURATOR'
  }
];

export const merchantToCategoryMapping: { [key: string]: any } = {
  'Amazon': {
    'Sports': {
      'cashBackPercent': 10.8,
      'user': 'user1@gmail.com'
    },
    'Electronics': {
      'cashBackPercent': 12,
      'user': 'user2@gmail.com'
    },
    'Apparel': {
      'cashBackPercent': 15,
      'user': 'user1@gmail.com'
    },
    'Toys': {
      'cashBackPercent': 20,
      'user': 'user2@gmail.com'
    },
    'Medicines': null
  },
  'Nike': {
    'Sports': {
      'cashBackPercent': 10.8,
      'user': 'user1@gmail.com'
    },
    'Fitness': {
      'cashBackPercent': 20,
      'user': 'user2@gmail.com'
    }
  },
  'Lakme': {
    'Fashion': {
      'cashBackPercent': 13,
      'user': 'user1@gmail.com'
    },
    'Fitness': {
      'cashBackPercent': 5,
      'user': 'user2@gmail.com'
    }
  },
  'Walmart': {
    'Fashion': {
      'cashBackPercent': 13,
      'user': 'user1@gmail.com'
    },
    'Fitness': {
      'cashBackPercent': 5,
      'user': 'user2@gmail.com'
    }
  },
  'Jet': {
    'Airlines': {
      'cashBackPercent': 14,
      'user': 'user1@gmail.com'
    },
    'Medicines': {
      'cashBackPercent': 2.5,
      'user': 'user2@gmail.com'
    }
  },
  'Macys': {
    'Fashion': {
      'cashBackPercent': 9.2,
      'user': 'user1@gmail.com'
    },
    'Sports': {
      'cashBackPercent': 5.5,
      'user': 'user2@gmail.com'
    }
  }
}

export const curatorToRetailer: {[key: string]: string []} = {
  'jchaganti@gmail.com' : ['Amazon', 'Nike'],
  'gchaganti@gmail.com': ['Macys'],
  'sai@gmail.com': ['Nike']
}