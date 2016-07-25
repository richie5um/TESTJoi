export function schema() {
    return {
        schema: {
            $type: 'object',
            $properties: ['console', 'trusted_owners', 'trusted_vendors', 'advanced_settings'],
            console: {
                $type: 'object',
                $properties: ['application_control', 'settings'],
                application_control: {
                    $type: 'object',
                    $properties: ['security_posture'],
                    security_posture: {
                        $type: 'object',
                        $properties: ['enabled', 'state'],
                        enabled: {
                            $type: 'boolean',
                            $display: 'APPLICATION_CONTROL_SECURITY_POSTURE_ENABLED'
                        },
                        state: {
                            $type: 'number',
                            $minimum: 1,
                            $maximum: 4,
                            $description: {
                                '1': 'SECURITY_POSTURE_LEVEL_1_DESCRIPTION',
                                '2': 'SECURITY_POSTURE_LEVEL_2_DESCRIPTION',
                                '3': 'SECURITY_POSTURE_LEVEL_3_DESCRIPTION',
                                '4': 'SECURITY_POSTURE_LEVEL_4_DESCRIPTION'
                            }
                        }
                    }
                },
                settings: {
                    $type: 'object',
                    $properties: ['application_control'],
                    application_control: {
                        $type: 'object',
                        $properties: ['settings', 'message_settings'],
                        settings: {
                            $type: 'object',
                            $properties: ['enabled'],
                            enabled: {
                                $type: 'boolean',
                                $display: 'SETTINGS_APPLICATION_CONTROL_ENABLE'
                            }
                        },
                        message_settings: {
                            $type: 'object',
                            $properties: ['access_denied'],
                            access_denied: {
                                $type: 'object',
                                $properties: ['title', 'body', 'width', 'height'],
                                $required: ['title', 'body'],
                                title: {
                                    $type: 'string',
                                    $display: 'SETTINGS_APPLICATION_CONTROL_MESSAGE_SETTINGS_ACCESS_DENIED_TITLE'
                                },
                                body: {
                                    $type: 'string',
                                    $display: 'SETTINGS_APPLICATION_CONTROL_MESSAGE_SETTINGS_ACCESS_DENIED_BODY'
                                },
                                width: {
                                    $type: 'number',
                                    $display: 'SETTINGS_APPLICATION_CONTROL_MESSAGE_SETTINGS_ACCESS_DENIED_WIDTH'
                                },
                                height: {
                                    $type: 'number',
                                    $display: 'SETTINGS_APPLICATION_CONTROL_MESSAGE_SETTINGS_ACCESS_DENIED_HEIGHT'
                                }
                            }
                        }
                    }
                }
            },
            trusted_owners: {
                $type: 'object',
                $properties: ['settings'],
                settings: {
                    $type: 'object',
                    $properties: ['change_ownership', 'accounts'],
                    accounts: {
                        $type: 'array',
                        $properties: ['name', 'sid'],
                        name: {
                            $display: 'APPLICATION_CONTROL_TRUSTED_OWNERS_OWNER',
                            $type: 'string'
                        },
                        sid: {
                            $type: 'string',
                            $hidden: true
                        }
                    },
                    change_ownership: {
                        $type: 'boolean'
                    }
                }
            },
            trusted_vendors: {
                $type: 'object',
                $properties: ['settings'],
                settings: {
                    $type: 'object',
                    $properties: ['vendors'],
                    vendors: {
                        $type: 'array',
                        $properties: ['vendor'],
                        vendor: {
                            $display: 'APPLICATION_CONTROL_TRUSTED_VENDORS_VENDOR',
                            $type: 'string'
                        }
                    }
                }
            },
            advanced_settings: {
                $type: 'object',
                $properties: ['functionality', 'general_features'],
                functionality: {
                    $type: 'object',
                    $properties: ['settings'],
                    settings: {
                        $type: 'object',
                        $properties: ['application_access_control', 'browser_control', 'network_access_control', 'privilege_management'],
                        application_access_control: {
                            $type: 'boolean'
                        },
                        browser_control: {
                            $type: 'boolean'
                        },
                        network_access_control: {
                            $type: 'boolean'
                        },
                        privilege_management: {
                            $type: 'boolean'
                        }
                    }
                },
                general_features: {
                    $type: 'object',
                    $properties: ['settings'],
                    settings: {
                        $type: 'object',
                        $properties: ['cmd_batch_files', 'deny_removable_media', 'local_drives', 'logon_restrictions'],
                        cmd_batch_files: {
                            $type: 'boolean'
                        },
                        deny_removable_media: {
                            $type: 'boolean'
                        },
                        local_drives: {
                            $type: 'boolean'
                        },
                        logon_restrictions: {
                            $type: 'boolean'
                        }
                    }
                }
            }
        }
    }
};
