"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
  children: React.ReactNode
}

interface ComboboxItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

interface ComboboxGroupProps {
  heading?: string
  children: React.ReactNode
}

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  ({ 
    value, 
    onValueChange, 
    placeholder = "Select option...", 
    searchPlaceholder = "Search...",
    emptyText = "No option found.",
    disabled = false,
    className,
    children 
  }, ref) => {
    const [open, setOpen] = React.useState(false)
    const [displayValue, setDisplayValue] = React.useState("")

    // Find the display value for the selected item
    React.useEffect(() => {
      if (!value) {
        setDisplayValue("")
        return
      }

      const findSelectedItem = (children: React.ReactNode): string => {
        if (React.isValidElement(children)) {
          if (children.type === ComboboxItem && children.props.value === value) {
            return children.props.children?.toString() || ""
          }
          if (children.props.children) {
            const found = findSelectedItem(children.props.children)
            if (found) return found
          }
        }
        if (Array.isArray(children)) {
          for (const child of children) {
            const found = findSelectedItem(child)
            if (found) return found
          }
        }
        return ""
      }
      
      setDisplayValue(findSelectedItem(children))
    }, [value, children])

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              !value && "text-muted-foreground",
              className
            )}
            disabled={disabled}
          >
            {displayValue || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {React.Children.map(children, (child) => {
                  if (React.isValidElement(child) && child.type === ComboboxItem) {
                    return React.cloneElement(child, {
                      ...child.props,
                      selected: child.props.value === value,
                      onSelect: (currentValue: string) => {
                        onValueChange?.(currentValue === value ? "" : currentValue)
                        setOpen(false)
                      }
                    })
                  }
                  return child
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)
Combobox.displayName = "Combobox"

const ComboboxItem = React.forwardRef<
  HTMLDivElement,
  ComboboxItemProps & { selected?: boolean; onSelect?: (value: string) => void }
>(({ value, children, className, selected, onSelect }, ref) => (
  <CommandItem
    ref={ref}
    value={value}
    onSelect={() => onSelect?.(value)}
    className={className}
  >
    <Check
      className={cn(
        "mr-2 h-4 w-4",
        selected ? "opacity-100" : "opacity-0"
      )}
    />
    {children}
  </CommandItem>
))
ComboboxItem.displayName = "ComboboxItem"

const ComboboxGroup = React.forwardRef<
  HTMLDivElement,
  ComboboxGroupProps
>(({ heading, children }, ref) => (
  <CommandGroup ref={ref} heading={heading}>
    {children}
  </CommandGroup>
))
ComboboxGroup.displayName = "ComboboxGroup"

export { Combobox, ComboboxItem, ComboboxGroup }
