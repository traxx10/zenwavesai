import { Defs, Image, Pattern, Rect, Svg, Use } from 'react-native-svg'

export const TabAccountIcon = (props) => {
 const { width, height, color } = props
 return (
  <Svg
   width={width || '21'}
   height={height || '21'}
   viewBox="0 0 21 21"
   fill="none"
   xmlns="http://www.w3.org/2000/svg"
   xmlnsXlink="http://www.w3.org/1999/xlink"
   {...props}
  >
   <Rect
    width={width || '21'}
    height={height || '21'}
    // stroke={color || 'black'}
    fill="url(#pattern0_1_1247)"
    fillOpacity="0.62"
   />
   <Defs>
    <Pattern id="pattern0_1_1247" patternContentUnits="objectBoundingBox" width="1" height="1">
     <Use xlinkHref="#image0_1_1247" transform="scale(0.01)" />
    </Pattern>
    <Image
     id="image0_1_1247"
     width="100"
     height="100"
     xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAADf0lEQVR4nO3dX2iPURzH8UMuWGLzLyP/L1zIhUtt7pASN8QUcaNk5U80ciG58CdSXNAWVyTlz524UJq4sM0kFlnZkAvJLIwx21unndq0n/Xbb895zvfZ+b5qN/u13znf82nP8/s9zznnMUYppZRSSimllFKqIMBEYC1wGrgDNANtQJf7aXO/s6+dAtYAE3S4EwasAG4APxk6+zfXgeUazPCDWAbUkZzHQJkGM/QgxgHVQA/Js+95ARirweQXxmzgKf41ArM0lMHDmA+0kJ43wDwNJXcYk4HXKYbRP5SpGsq/YYwG7hPOPdsHDaUvkH2Et0cD6Q1jBtAROg3gO1AafShADXKcjzoQezIFOpGjE5hmYgUcRJ4qE6uUvgAOVb2JETAHmXqAmSY2wGbkqjCxAc4i1xkTG+Auct02sQFeIVeTiQ3wGbk+mdgUeDs2LT9MbNykBKm6TGz0kCWMuzEkVbOJDdCAXHUmNsBV5LpsYgMcQq4DJjZumqdUq02ks0y6kecPMMnEKOFpokl5ZGIFHEWewyZWwBLkWWxiJuw2boOJHbALOSpN7IAS4GvoJOjtQ0no8RABOBk6DeB46HEQA5gCfAsYRkfUE+RyAU4EDORY6PrFAYqA1gBhvAfGh65fJGBjgEDWh65bNOBWimHcDF2veEBxSusM39kLnKHrzQSgDPjlMQz73ktD15kpQIWny/N2MvWW0PVlErDTQyB7Q9eVaSQsdD2ZhwYiCxqILGggsqCByIIGIgsaiCxoIHIApUkHAkwPXVdm4WelbnwrbJMAbPN0Lcu+59bQ9WUGMMbtgdLtef5ulW0rdL1iAaOAVW5zyrQ8AVbatkPXL20X0t3AC8J57voQ5y6lwFw3AA897c07HE3AEWChGcmARa5QyWsLc4VjpyeVZ/6w5s4Jdqvwc8Bbsq/VfQwvNxmcq1slfC+T4XoJ7LdPazDCg7ALcNqJxxd3GC42AhdwfiBeH4F1Up5icC30aAhyJdhTF9yEtgehR0Cg2tTPLW5itP2Wq3Krt0ePNAO59J+OqD7VaYWxqV+janAb0jiJ2/UUKj/2k2eRz0Aq8+yI6rPDZyDP+jWk8tPoK4wFeXZADZT8c67sv16OhlR+tvsI5GKejauBanwEYm8mqcLU+ghkJNzTCKXFRyAS9iPJqvbYdqKW7nfigSillFJKKaWUUsr49xevw9Er5DHseAAAAABJRU5ErkJggg=="
    />
   </Defs>
  </Svg>
 )
}
