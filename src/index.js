'use strict'
const boom = require('@hapi/boom')


function validateHTML(html) {
  try {
    let message = 'The tags in this html are correct'
    let status = true
    html = html.toLowerCase().replace(/(?<=<[^>]+?=\s*"[^"]*)[<>]/g, '').replace(/(?<=<[^>]+?=\s*'[^']*)[<>]/g, '') // Borra todos <> de las propiedades de las etiquetas
    html = html.replace(/<script.*?<\/script>/g, '') // Borra todos los elementos script
    html = html.replace(/<style.*?<\/style>/g, '') // Borra todo los elementos style
    html = html.toLowerCase().replace(/<[^>]*\/\s?>/g, '') // Elimina todas las etiquetas de cierre
    html = html.replace(/<(!|br|hr|img).*?>/g, '') // Borra todas las etiquetas <br>, <hr>, <img>
    html = html.replace(/^[^<>]+|[^<>]+$|(?<=>)[^<>]+(?=<)/gs, '') // Borra todos los textos limpios
    const tags = html.split(/(?<=>)(?=<)/)
    if (tags.length === 1 && tags[0] === '') {
      status = true // No existe ningun elemento con tag
      return {
        status,
        message
      }
    }
    if (tags.length % 2 === 1) {
      message = `Uneven number of tags in ${html}`
      status = false
      return {
        status,
        message
      }
    }
    let tagno = 0
    while (tags.length > 0) {
      if (tagno === tags.length) {
        message = `These tags are not closed: ${tags.slice(0, tagno).join()}`
        status = false
        return {
          status,
          message
        }
      }
      if (tags[tagno].slice(0, 2) === '</') {
        if (tagno === 0) {
          message = `This tag has not been opened: ${tags[0]}`
          status = false
          return {
            status,
            message
          }
        }
        const tagSearch = tags[tagno].match(/<\/\s*([\w\-_]+)\s*>/)
        if (tagSearch === null) {
          message = `Could not identify closing tag  ${tags[tagno]} after ${tags.slice(0, tagno).join()}`
          status = false
          return {
            status,
            message
          }
        } else tags[tagno] = tagSearch[1]
        if (tags[tagno] === tags[tagno - 1]) {
          tags.splice(tagno - 1, 2)
          tagno--
        } else {
          message = `Tag '${tags[tagno]}' trying to close these tags: ${tags.slice(0, tagno).join()}`
          status = false
          return {
            status,
            message
          }
        }
      } else {
        tags[tagno] = tags[tagno].replace(/(?<=<\s*[\w_-]+)(\s+[\w_-]+(\s*=\s*(".*?"|'.*?'|[^\s="'<>`]+))?)*/g, '') // Borra todas las propiedades correctas de las etiquetas
        tags[tagno] = tags[tagno].replace(';',''); // Borra posibles ; de cierres de estilos en línea
        let tagSearch = tags[tagno].match(/<(\s*[\w\-_]+)/)
        if ((tagSearch === null) || (tags[tagno] !== '<' + tagSearch[1] + '>')) {
          message = `Fragmented tag with the following remains: ${tags[tagno]}`
          status = false
          return {
            status,
            message
          }
        }
        tagSearch = tags[tagno].match(/<\s*([\w\-_]+)/)
        if (tagSearch === null) {
          message = `Could not identify opening tag ${tags[tagno]} after ${tags.slice(0, tagno).join()}`
          status = false
          return {
            status,
            message
          }
        } else tags[tagno] = tagSearch[1]
        tagno++
      }
    }
    status = true
    return {
      status,
      message
    }
  } catch (error) {
    const {
      response
    } = error

    throw boom.boomify(error, {
      message: response.data.message,
      statusCode: response.data.status
    })
  }
}


module.exports = {
  validateHTML
}