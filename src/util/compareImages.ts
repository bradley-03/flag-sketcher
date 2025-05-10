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

export async function compareImages(drawnImage: Base64URLString, flagImage: string) {
  const bufferedDrawnImage = dataURLToBuffer(drawnImage)
  const resizedDrawnImageBuffer = await resizeImageToPNGBuffer(bufferedDrawnImage, 256, 160)
  const drawnPng = PNG.sync.read(resizedDrawnImageBuffer)

  const response = await fetch(flagImage)
  const arrayBufferedFlagImage = await response.arrayBuffer()
  const bufferedFlagImage = Buffer.from(arrayBufferedFlagImage)
  const resizedFlagImageBuffer = await resizeImageToPNGBuffer(bufferedFlagImage, 256, 160)
  const flagPng = PNG.sync.read(resizedFlagImageBuffer)

  const diff = new PNG({ width: 256, height: 160 })

  const numDiffPixels = pixelmatch(drawnPng.data, flagPng.data, diff.data, 256, 160, { threshold: 0.5 })

  const totalPixels = 256 * 160
  const accuracy = 1 - numDiffPixels / totalPixels

  console.log(accuracy)

  return { accuracy, numDiffPixels }
}
