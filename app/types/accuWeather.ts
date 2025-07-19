export interface AccuWeatherLocation {
  Key: string;
  LocalizedName: string;
  Country: {
    LocalizedName: string;
  };
  AdministrativeArea: {
    LocalizedName: string;
  };
}

export interface AccuWeatherCurrent {
  LocalObservationDateTime: string;
  EpochTime: number;
  WeatherText: string;
  WeatherIcon: number;
  HasPrecipitation: boolean;
  PrecipitationType: string | null;
  IsDayTime: boolean;
  Temperature: {
    Metric: {
      Value: number;
      Unit: string;
    };
    Imperial: {
      Value: number;
      Unit: string;
    };
  };
  RealFeelTemperature: {
    Metric: {
      Value: number;
      Unit: string;
    };
    Imperial: {
      Value: number;
      Unit: string;
    };
  };
  RelativeHumidity: number;
  IndoorRelativeHumidity: number;
  DewPoint: {
    Metric: {
      Value: number;
      Unit: string;
    };
    Imperial: {
      Value: number;
      Unit: string;
    };
  };
  Wind: {
    Direction: {
      Degrees: number;
      Localized: string;
    };
    Speed: {
      Metric: {
        Value: number;
        Unit: string;
      };
      Imperial: {
        Value: number;
        Unit: string;
      };
    };
  };
  WindGust: {
    Speed: {
      Metric: {
        Value: number;
        Unit: string;
      };
      Imperial: {
        Value: number;
        Unit: string;
      };
    };
  };
  UVIndex: number;
  UVIndexText: string;
  Visibility: {
    Metric: {
      Value: number;
      Unit: string;
    };
    Imperial: {
      Value: number;
      Unit: string;
    };
  };
  ObstructionsToVisibility: string;
  CloudCover: number;
  Ceiling: {
    Metric: {
      Value: number;
      Unit: string;
    };
    Imperial: {
      Value: number;
      Unit: string;
    };
  };
  Pressure: {
    Metric: {
      Value: number;
      Unit: string;
    };
    Imperial: {
      Value: number;
      Unit: string;
    };
  };
  PressureTendency: {
    LocalizedText: string;
    Code: string;
  };
  Past24HourTemperatureDeparture: {
    Metric: {
      Value: number;
      Unit: string;
    };
    Imperial: {
      Value: number;
      Unit: string;
    };
  };
  ApparentTemperature: {
    Metric: {
      Value: number;
      Unit: string;
    };
    Imperial: {
      Value: number;
      Unit: string;
    };
  };
  WindChillTemperature: {
    Metric: {
      Value: number;
      Unit: string;
    };
    Imperial: {
      Value: number;
      Unit: string;
    };
  };
  WetBulbTemperature: {
    Metric: {
      Value: number;
      Unit: string;
    };
    Imperial: {
      Value: number;
      Unit: string;
    };
  };
  Precip1hr: {
    Metric: {
      Value: number;
      Unit: string;
    };
    Imperial: {
      Value: number;
      Unit: string;
    };
  };
  PrecipitationSummary: {
    Precipitation: {
      Metric: {
        Value: number;
        Unit: string;
      };
      Imperial: {
        Value: number;
        Unit: string;
      };
    };
    PastHour: {
      Metric: {
        Value: number;
        Unit: string;
      };
      Imperial: {
        Value: number;
        Unit: string;
      };
    };
    Past3Hours: {
      Metric: {
        Value: number;
        Unit: string;
      };
      Imperial: {
        Value: number;
        Unit: string;
      };
    };
    Past6Hours: {
      Metric: {
        Value: number;
        Unit: string;
      };
      Imperial: {
        Value: number;
        Unit: string;
      };
    };
    Past9Hours: {
      Metric: {
        Value: number;
        Unit: string;
      };
      Imperial: {
        Value: number;
        Unit: string;
      };
    };
    Past12Hours: {
      Metric: {
        Value: number;
        Unit: string;
      };
      Imperial: {
        Value: number;
        Unit: string;
      };
    };
    Past18Hours: {
      Metric: {
        Value: number;
        Unit: string;
      };
      Imperial: {
        Value: number;
        Unit: string;
      };
    };
    Past24Hours: {
      Metric: {
        Value: number;
        Unit: string;
      };
      Imperial: {
        Value: number;
        Unit: string;
      };
    };
  };
  TemperatureSummary: {
    Past6HourRange: {
      Minimum: {
        Metric: {
          Value: number;
          Unit: string;
        };
        Imperial: {
          Value: number;
          Unit: string;
        };
      };
      Maximum: {
        Metric: {
          Value: number;
          Unit: string;
        };
        Imperial: {
          Value: number;
          Unit: string;
        };
      };
    };
    Past12HourRange: {
      Minimum: {
        Metric: {
          Value: number;
          Unit: string;
        };
        Imperial: {
          Value: number;
          Unit: string;
        };
      };
      Maximum: {
        Metric: {
          Value: number;
          Unit: string;
        };
        Imperial: {
          Value: number;
          Unit: string;
        };
      };
    };
    Past24HourRange: {
      Minimum: {
        Metric: {
          Value: number;
          Unit: string;
        };
        Imperial: {
          Value: number;
          Unit: string;
        };
      };
      Maximum: {
        Metric: {
          Value: number;
          Unit: string;
        };
        Imperial: {
          Value: number;
          Unit: string;
        };
      };
    };
  };
  MobileLink: string;
  Link: string;
}

export interface AccuWeatherInfo {
  location: AccuWeatherLocation;
  current: AccuWeatherCurrent;
}
