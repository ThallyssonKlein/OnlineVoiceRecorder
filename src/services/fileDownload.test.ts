import { downloadBlob } from '@services/fileDownload'

describe('downloadBlob', () => {
  it('should click a download link with the file name and release the object URL', () => {
    const createObjectURL = jest.fn().mockReturnValue('blob:fake-url')
    const revokeObjectURL = jest.fn()
    Object.assign(URL, { createObjectURL, revokeObjectURL })
    const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
    const blob = new Blob(['audio'], { type: 'audio/mpeg' })

    downloadBlob({ blob, fileName: 'recording.mp3' })

    expect(createObjectURL).toHaveBeenCalledWith(blob)
    expect(clickSpy).toHaveBeenCalledTimes(1)
    expect(clickSpy.mock.instances[0]).toMatchObject({ download: 'recording.mp3' })
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:fake-url')
    clickSpy.mockRestore()
  })
})
