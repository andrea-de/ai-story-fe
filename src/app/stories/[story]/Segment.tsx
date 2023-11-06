interface SegmentProperties { 
    segment: string, 
    segmentKey: string, 
    regenerate?: any, 
    isLoading: boolean }

export const Segment = ({ segment, segmentKey, regenerate = undefined, isLoading }: SegmentProperties ) => {
    return (
        <div className={`relative ${regenerate != undefined ? 'cursor-pointer' : 'mb-4'}`}>
            {segment}
            {regenerate != undefined && !isLoading &&
                <div onClick={regenerate ? (event) => regenerate(segmentKey, event) : undefined}
                    className='text-sm italic underline relative right-1 text-right text-white'>
                    regenerate
                </div>
            }
        </div>
    )
}