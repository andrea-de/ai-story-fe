export const mockStream = () => {
    return new ReadableStream({
        start(controller) {
            // This will be called when the stream starts
            // You can use the controller to push data into the stream
            // For example, you can push chunks of data using `controller.enqueue()`
            // You can also signal the end of the stream using `controller.close()`

            // Push data into the stream
            setTimeout(() => { controller.enqueue('This is a'); }, 300); // Delay of 1 second
            setTimeout(() => { controller.enqueue(' mock stream'); }, 500); // Delay of 2 seconds
            setTimeout(() => { controller.enqueue(' of ai'); }, 700); // Delay of 3 seconds
            setTimeout(() => { controller.enqueue(' generated'); }, 1000); // Delay of 4 seconds
            setTimeout(() => { controller.enqueue(' text.'); }, 1100); // Delay of 5 seconds

            // Signal the end of the stream
            setTimeout(() => { controller.close(); }, 1200); // Delay of 6 seconds
        },
    });
}