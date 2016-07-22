export function schema() {
    return {
        $type: 'object',
        $properties: ['settings'],
        settings: {
            $type: 'object',
            $properties: ['array', 'sub-object', 'badger'],
            'array': {
                $type: 'array',
                $properties: ['name', 'sid'],
                $required: ['name'],
                name: {
                    $display: 'Owner',
                    $type: 'string'
                },
                sid: {
                    $type: 'string',
                    $hidden: true
                }
            },
            'sub-object': {
                $type: 'object',
                $properties: ['string', 'boolean', 'number', 'regex'],
                $required: ['string', 'boolean'],
                string: {
                    $type: 'string'
                },
                boolean: {
                    $type: 'boolean'
                },
                number: {
                    $type: 'number',
                    $minimum: 1,
                    $maximum: 4
                },
                regex: {
                    $display: 'colour',
                    $type: 'string',
                    $pattern: '^#(?:[0-9a-fA-F]{3}){1,2}$'
                }
            },
            badger: {
                $type: 'number'
            }
        }
    }
};
