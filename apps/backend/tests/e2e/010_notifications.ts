import { Container } from '@n8n/di'
import { describe, it, expect } from 'vitest'
import { NotificationsRepository } from '@/features/notifications/repository'
import { ulid } from 'ulidx'

describe('Notifications Feature', () => {
  const notificationRepository = Container.get(NotificationsRepository)
  let notificationId: string

  it('should create a notification', async () => {
    const payload = {
      id: ulid(),
      content: 'Test notification',
      date: new Date().toISOString(),
      count: 1,
      image: null
    }
    const result = await notificationRepository.create(payload)
    expect(result.isOk).toBe(true)
    const notification = result.match({
      Ok: (val) => val,
      Err: (err) => { throw new Error(String(err)) }
    })
    expect(notification.content).toBe('Test notification')
    notificationId = notification.id
  })

  it('should list notifications', async () => {
    const result = await notificationRepository.list({ page: 1, per_page: 10 })
    expect(result.isOk).toBe(true)
    const notifications = result.match({
      Ok: (val) => val,
      Err: (err) => { throw new Error(String(err)) }
    })
    expect(Array.isArray(notifications.data)).toBe(true)
  })


  it('should get notification count', async () => {
    const result = await notificationRepository.getCount()
    expect(result.isOk).toBe(true)
    const count = result.match({
      Ok: (val) => val,
      Err: (err) => { throw new Error(String(err)) }
    })
    expect(typeof count).toBe('number')
  })

  it('should get a notification by id', async () => {
    if (!notificationId) return
    const result = await notificationRepository.findById(notificationId)
    expect(result.isOk).toBe(true)
    const notification = result.match({
      Ok: (val) => val,
      Err: (err) => { throw new Error(String(err)) }
    })
    expect(notification?.id).toBe(notificationId)
  })


  it('should delete a notification', async () => {
    if (!notificationId) return
    const result = await notificationRepository.deleteById(notificationId)
    expect(result.isOk).toBe(true)
  })
})