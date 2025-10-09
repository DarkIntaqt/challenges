import debounce from "@cgg/utils/debounce";

test("debounce function delays execution", async () => {
   // using vitest fake timers and check if debounce function works
   const fn = vi.fn();
   vi.useFakeTimers();
   const bounce = debounce(fn, 100);

   bounce();
   expect(fn).not.toBeCalled();

   bounce();
   expect(fn).not.toBeCalled();

   vi.advanceTimersByTime(50);
   expect(fn).not.toBeCalled();
   bounce();

   vi.advanceTimersByTime(90);
   expect(fn).not.toBeCalled();

   vi.advanceTimersByTime(15);
   expect(fn).toBeCalledTimes(1);

   bounce();
   vi.advanceTimersByTime(100);
   expect(fn).toBeCalledTimes(2);

   vi.useRealTimers();
});
