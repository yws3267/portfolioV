import express, { Request, Response } from 'express'
import Project, { IProject } from '../models/Project'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 })
    res.status(200).json(projects)
  } catch (error) {
    console.error('프로젝트 조회 오류:', error)
    res.status(500).json({ message: '프로젝트 조회 실패' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const newProject: IProject = new Project(req.body)
    const savedProject = await newProject.save()
    res.status(201).json(savedProject)
  } catch (error) {
    console.error('프로젝트 생성 오류:', error)
    res.status(400).json({ message: '유효하지 않은 데이터.', error })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ message: '프로젝트 조회 실패.' })
    }
    res.status(200).json(project)
  } catch (error) {
    console.error('프로젝트 조회 오류:', error)
    res.status(500).json({ message: '서버 오류 발생.' })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { title, description, link } = req.body

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, link },
      { new: true, runValidators: true }
    )

    if (!updatedProject) {
      return res.status(404).json({ message: '프로젝트 조회 실패.' })
    }
    res.status(200).json(updatedProject)
  } catch (error) {
    console.error('프로젝트 업데이트 오류:', error)
    res.status(400).json({
      message: '유효하지 않은 데이터',
      error,
    })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id)
    if (!deletedProject) {
      return res.status(404).json({ message: '프로젝트 조회 실패' })
    }
    res.status(200).json({ message: '프로젝트 삭제됨.' })
  } catch (error) {
    console.error('프로젝트 삭제 오류:', error)
    res.status(500).json({ message: '서버 오류 발생.' })
  }
})

module.exports = router
