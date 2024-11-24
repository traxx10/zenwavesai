import * as React from 'react'
import Svg, { Path, Defs, Pattern, Use, Image } from 'react-native-svg'

export const TabHomeSelectedIcon = (props) => {
 const { width, height, color } = props
 return (
  <Svg
   xmlns="http://www.w3.org/2000/svg"
   xmlnsXlink="http://www.w3.org/1999/xlink"
   width={width || 21}
   height={height || 21}
   fill="none"
   {...props}
  >
   <Path fill="url(#a)" d="M0 0h21v21H0z" />
   <Defs>
    <Pattern id="a" width={1} height={1} patternContentUnits="objectBoundingBox">
     <Use xlinkHref="#b" transform="scale(.01)" />
    </Pattern>
    <Image
     xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAETklEQVR4nO2dS2hkRRSGy/H9QFFEVEQQx03QMV2nE6OODgiCggtBRnyAG2EYRJHRRdLndLwBEURQVFAZF4qCLrIZdSWICKIwIggiiBtBRMQZFBlhfE9+qZCRNiZNuvveOvd2/x/8uyRddb6cuunK7VshEEIIIYQQQggZCDHsFMWLqzHsHOy7SWns3o0To+FJMayIAT3ZL3twMkudESlwflS8t05Ebz6cKXAhpeSQoYii+KaPjOP5LirmKKVaGfdFw69bkHE8v8cuHqaUktn+EE4VxcsDiPhPouL1uX04nWJKYLbAJaI4OKyMHimfzRouo5QRaBlujIYfRpXxrxTDj9LBzZQyMDghrf1i+LMsGT1S/hbDUnoNitkCUwXOEsNy2SI2WMLelnmcQyl9mO7iimj4omoZPVK+mu5gilI2IHZxmyh+ziWjZwn7pa24g1J6rheimBfFsdwyerKStmHSdsxEi5krcJ4Y3nUUgXVL2Ac7ClwQJpEZxXQ0fO0tQf4v5dv2ImbCJBEN94riqHfxZXMpv4nh/jDu7Cpw0tqWORqS/VMFTgnjSKvAxVHxcQ2KjAHzqczj0jBOSAfXi+H7GhQXQ+ZwNNwUxoGo2COKP2pQVIySqPgr/XkemsquAqeJ4hXvQkr5Yt7c8SjODE0irbmra28NCijV5HMxXB6aQFtxa1T8VIOioeJOOSJd3B7qSy22QOCx5RIKbAt1QgqcIYoDNSgQXLrF8FaqQagD6X8K0fCJd1HEO4qDswXOdr/5IG3IuRfDahLF+67v7KPiafciWO3ylIuM1gKunbALOLYUxTGXG/Qaui+FHImGj/LK6OAG70lLzdM2XJdPiOE17wlL/fNqHhsFtoniUA0mjJrncJY3jO0OrqzBZNGEZLnFqN3BXd4TlYYkdnBn5UKki33eE5WGJMtHIUSx6D1RaUoUi9ULMSy5T9QakyUKMXcJFCL+hacQ8S82hYh/gSlE/ItKIeJfSAqpQfFAIf4FA4X4FwkU4l8YUIh/MVCDcOtE/CVQiPgXnkLEv9gUIv4FphBZ9+CY9IySaHhs7U77TbP6NYZ3nG/mG+OLuuLQMJ8fl0Vck+4AoZCyhXSGf85Vy3ALhZTbHV+GEUlP/uGSVZ6QAyMLSR+q4TWktC5ZHlVIjoeiTdJFfbmEcVMIhYAdshnsEC5Z4DWkD+wQdgjYIX1gh7BDwA7pAzuEHQJ2SB/YIewQsEP6wA5hh4Ad0gd2CDsE7JCJ7BCFOUzsjVHHnZ63m3vc0aChaqSDe7JPTPH4yONWPOHwi3R3yHEISzomKOOkVqa7uHrUcbe7aG1wkHGVv0RHrlrAuSEHongwo5AXyhp3NLyUUcgDISfpITQDnks7zG2jz6QzR8oac/pZYnhu7SzDamQojrqdvyuKi0SxVxTPrp5jXkKi4nkxPNJawPYqj+dLr7H2WqWMe7UGir08NpwQQgghhBBCCAljxD80x4/KiiITiwAAAABJRU5ErkJggg=="
     id="b"
     width={100}
     height={100}
    />
   </Defs>
  </Svg>
 )
}
