import helloData from './data/hello.json';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  res.status(200).json(helloData)
}
