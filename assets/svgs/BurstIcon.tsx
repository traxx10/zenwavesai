import * as React from 'react'
import Svg, { Path, Defs, Pattern, Use, Image } from 'react-native-svg'
export const BurstIcon = (props) => {
 const { width, height } = props
 return (
  <Svg
   xmlns="http://www.w3.org/2000/svg"
   xmlnsXlink="http://www.w3.org/1999/xlink"
   width={width || 24}
   height={height || 24}
   fill="none"
   {...props}
  >
   <Path fill="url(#a)" d="M0 0h24v24H0z" />
   <Defs>
    <Pattern id="a" width={1} height={1} patternContentUnits="objectBoundingBox">
     <Use xlinkHref="#b" transform="scale(.01)" />
    </Pattern>
    <Image
     xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFMUlEQVR4nO2da6gVVRSA52qZlWahXciQCCypjKgIej9AKOgllRIUQfSgp5cokkiiKMKeVH+MoAhDyqJIpBehBRUZ2YPoHYphGZk3eyhe7V6/2J11apJzzp0zs+acteesD+6/e86sNd/svWftmb1PkjiO4ziO4ziO4ziO43QMYF/gUuAlYLP8PQ1Mdg2dk7A/cCXwKrCdxrwLjHEp5Uk4ELgBWAkMk43jXYiuhIOAAbnaR2if2S6kuITDgQXAxxTjL2CaC8kn4RjgHuAr9FjgMrILGAOcCDwIrFWUsBV4ATjDZYwuYSxwMvAo8IOyhOXAZcAEF5Fdwk+KEgaBxcC5wB4uobWEPeVEhRP2m6KEjSkJu7uE1hImAZcAL0oXosUa4AHgBM0iT1ru6cBjcowdwHtR1y3AFOAK4BVgSFHCF8DdwNHK8Y4DzgKekNbWiD+BGUksAFOB64EVbVTLWfgIuB04rITuczbwjMxxZeHhpOLVcquWcCdwqHK8e6XGsD9yxLUksUa4UuWKDVeuFsPSskILm6oc72Tgcrn9Ldp9DiRWAOYCn6PHdhljwlgzRTnWA4BrgTdlmkSD90MLSywgd0k7FZLaKndb4fsmldB93gS8o9h97hQR15mqaYAvCyQV6o0lwIXaVxgwA7gNWI1u9/kWcGOY1k8skuOu6RfgSeBs7SsLOAq4q4Tu8zXgqvCAK7FOGxJKqZaBI+Su62tFCdtkoL86CglpRpHwkMzOalfLp0m1vF5Rwu/As8BFwN5a8UrMhwDzgVUyVn4THiVrHiN9sGY8r1wtnynV8s+KEjYBTwHnAOO14pWYj5SW+1mL41+jecxShaSq5cVtVMtZCLPHi4BZwG6K56EPOA5YCHybMZbvtI6fDkRNCDARuDh8FtiCHuvC1IZM6Wt3n6cCjwDf54hrRCuWdFCFhAD7yUMibQlr5XlKkNBX0rOaDUWD1IorHWAuITLNskyxWg58CtwBzFTOcTxwnrxI9yuKaMZZD7ZtITL7G+7CNKrlVcCtwHTlvCbIlNBSmV4vBc2Y64HnERKKt7wMA28D87Rf10l1n8ukFikdzfjrSeQREu7322EH8LoUav3K8ffL974hx+komrnUE8ojJAzg7VTL/coxT5PvXa48hrWNZl715LSFPCd9t+qrOcB0qZY/UJqdVkEzx3qiqkJKmOeaL08tTaKZbz1pU0L4b7KxyGOBjlE030YnoKtCqL1eeqxIyDplYYbCAhqckI4L4f/V8o9EjKoMOTkdE0JtwvE+eSW0EsQu5GUqRrRCgJlUkJiFXEAFiVnIHCqICzGGCzGGCzGGCzGGCzGGCzGGCzGGCzGGCzGGCzGGCzGGCzGGCzGGCzGGCzGGC+kBIc3WfS9t8Rl/QFWikGZb7S10Id0REjaY2ZUtrdZreAspV0hY7HizLKYMLzF/CJw0yme8yypLyC4nemzG/3MhNTYmFnAh/7IosYAL+YewImxiYoEeFjIIPB5eFE8s0WNChmTpXIh/XGKRHhAyIqu2BqL4gRhZ+90wkciFfCIlgM3NzZoB3N8koTURClkH3BuW0iWxIvtHNdrXZF4kQgZlcD5Fcx+VriJL0lZLdb9BmnqfYSHbZOw73+zg3OHqfk6XBucVsrev6k6p0UNnhdR3zz6423n3spD1sqpXdTP/ykI5QjbLFoKzKjM4RyhkyHzl3ANCRqKqnGOA2nbkeSrnW6KrnCP6zcLeqJxjgVpN0BuVcwwA+8iJ3yQ7XFe/cnYcx3Ecx3Ecx3EcJ7HH3/TG8hst2MjMAAAAAElFTkSuQmCC"
     id="b"
     width={100}
     height={100}
    />
   </Defs>
  </Svg>
 )
}
