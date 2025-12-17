import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FaqAccordianExtension() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-full sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[50vw]" defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-left text-sm sm:text-base">
          How to install PairCode extension?
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-3 sm:gap-4 text-balance text-sm sm:text-base">
          <p>PairCode extension can be installed two ways.</p>
          <p>
            First and the easiest way, is to go to VSCode editor and search for <strong>PairCode </strong> in the
            extensions marketplace.
          </p>
          <p>Or, you can directly download it from github releases. First option is the easiest and preferred one.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="text-left text-sm sm:text-base">
          How can I use it?
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-3 sm:gap-4 text-balance text-sm sm:text-base">
          <p>
            After installing the extension, choose a file and right click on that. 
          </p>
          <p>
            Choose <strong>Open with Pair Code </strong> option which will appear on the top.
          </p>
          <p>You have to be logged in before you can directly import code.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="text-left text-sm sm:text-base">
          Is my code stored in database?
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-3 sm:gap-4 text-balance text-sm sm:text-base">
          <p>
            No. We <strong>do not store </strong> any of your code anywhere.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger className="text-left text-sm sm:text-base">
          Does it ask for my permission?
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-3 sm:gap-4 text-balance text-sm sm:text-base">
          <p>
            Yes. We <strong>ask for your permission </strong> before importing code everytime.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-5">
        <AccordionTrigger className="text-left text-sm sm:text-base">
          How does it work?
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-3 sm:gap-4 text-balance text-sm sm:text-base">
          <p>For smaller files, we add the code and file name in a query param.</p>
          <p>For larger files, we copy them in clipboard and import it from there directly as a source.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}