export interface Test {
  id: string
  name: string
  description: string
  duration: string
  questions: number
  modules: string[]
  price: number
  image: string
  url: string
  freeQuestions: number
  isPaid: boolean
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface TestResult {
  id: string
  userId: string
  testId: string
  score: number
  profile: string
  completedAt: Date
  isPaid: boolean
}

export interface Purchase {
  id: string
  userId: string
  testId: string
  amount: number
  currency: string
  stripePaymentId: string
  status: 'pending' | 'completed' | 'failed'
  purchasedAt: Date
}
