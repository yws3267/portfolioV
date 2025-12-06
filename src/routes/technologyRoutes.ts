import express, { Request, Response } from 'express'
import Technology, { ITechnology } from '../models/Technology'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const technologies = await Technology.find().sort({ name: 1 })
    res.status(200).json(technologies)
  } catch (error) {
    console.error('기술 스택 조회 오류:', error)
    res.status(500).json({ message: '기술 스택 조회 실패.' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const newTechnology: ITechnology = new Technology(req.body)
    const savedTechnology = await newTechnology.save()
    res.status(201).json(savedTechnology)
  } catch (error) {
    console.error('기술 스택 생성 오류:', error)
    if ((error as any).code === 11000) {
      return res.status(409).json({ message: '중복된 기술 스택 이름.' })
    }
    res.status(400).json({ message: '유효하지 않은 데이터.', error })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedTechnology = await Technology.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!updatedTechnology) {
      return res.status(404).json({ message: '기술 스택 조회 실패.' })
    }
    res.status(200).json(updatedTechnology)
  } catch (error) {
    console.error('기술 스택 업데이트 오류:', error)
    res.status(400).json({ message: '유효하지 않은 데이터.', error })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedTechnology = await Technology.findByIdAndDelete(req.params.id)
    if (!deletedTechnology) {
      return res.status(404).json({ message: '기술 스택 조회 실패.' })
    }
    res.status(200).json({ message: '기술 스택 삭제됨.' })
  } catch (error) {
    console.error('기술 스택 삭제 오류:', error)
    res.status(500).json({ message: '서버 오류 발생.' })
  }
})

module.exports = router
