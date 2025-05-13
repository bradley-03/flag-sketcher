import pixelmatch from "pixelmatch"
import { PNG } from "pngjs"
import { Buffer } from "buffer"
import { Jimp } from "jimp"

const dataURLToBuffer = (dataURL: Base64URLString): Buffer => {
  const base64Data = dataURL.replace(/^data:image\/\w+;base64,/, "")
  return Buffer.from(base64Data, "base64")
}

async function resizeImageToPNGBuffer(buffer: Buffer, width: number, height: number): Promise<Buffer> {
  const image = await Jimp.read(buffer)
  image.resize({ w: width, h: height })
  return await image.getBuffer("image/png")
}

export async function getImageAspectRatio(image: Buffer | string): Promise<number> {
  try {
    const img = await Jimp.read(image)
    const { width, height } = img.bitmap

    return width / height
  } catch (error) {
    console.error("Error reading image:", error)
    return 3 / 2
  }
}

export async function compareImages(
  drawnImage: Base64URLString,
  flagImage: string
): Promise<{ accuracy: number; numDiffPixels: number }> {
  try {
    const response = await fetch(flagImage)
    const arrayBufferedFlagImage = await response.arrayBuffer()
    const bufferedFlagImage = Buffer.from(arrayBufferedFlagImage)
    const flagPng = PNG.sync.read(bufferedFlagImage)

    const bufferedDrawnImage = dataURLToBuffer(drawnImage)
    // Resize canvas image to match flag image size
    const resizedDrawnImageBuffer = await resizeImageToPNGBuffer(bufferedDrawnImage, flagPng.width, flagPng.height)
    const drawnPng = PNG.sync.read(resizedDrawnImageBuffer)

    const diff = new PNG({ width: flagPng.width, height: flagPng.height })

    const numDiffPixels = pixelmatch(drawnPng.data, flagPng.data, diff.data, flagPng.width, flagPng.height, {
      threshold: 0.5,
    })

    const totalPixels = flagPng.width * flagPng.height
    const accuracy = (1 - numDiffPixels / totalPixels) * 100

    return { accuracy, numDiffPixels }
  } catch (e) {
    console.error("Error comparing images: ", e)
    return { accuracy: 0, numDiffPixels: 0 }
  }
}
