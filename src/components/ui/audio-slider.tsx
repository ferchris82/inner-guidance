import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

const AudioSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center group py-2",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-300 dark:bg-gray-600 group-hover:h-3 transition-all duration-200">
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="relative block h-5 w-5 rounded-full bg-white border-2 border-blue-500 shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:pointer-events-none disabled:opacity-50 hover:h-6 hover:w-6 hover:border-blue-600 hover:shadow-xl active:scale-90 group-hover:border-blue-600 cursor-pointer before:absolute before:inset-0 before:rounded-full before:bg-blue-500 before:opacity-0 hover:before:opacity-10 before:transition-opacity" />
  </SliderPrimitive.Root>
))

AudioSlider.displayName = SliderPrimitive.Root.displayName

export { AudioSlider }
