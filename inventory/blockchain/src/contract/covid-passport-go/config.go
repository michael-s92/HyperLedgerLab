package main

import "path"

var Config = Cfg{
	Seeds: SeedsCfg{
		InputParametersPath: path.Join("hack", "seed", "seedParameters.yaml"),
		OutputJsonPath:      path.Join("hack", "seed", "seeds.json"),
		HostedUrl:           "https://storage.googleapis.com/milan-thesis-21/covid-passport/seeds-3x30.json",
		LoadSeedsFromUrl:    true,
	},
}

type Cfg struct {
	Seeds SeedsCfg
}
type SeedsCfg struct {
	InputParametersPath string
	OutputJsonPath      string
	HostedUrl           string
	LoadSeedsFromUrl    bool
}
