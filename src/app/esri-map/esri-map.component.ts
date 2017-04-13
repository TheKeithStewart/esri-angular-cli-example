import { Component, OnInit } from '@angular/core';

import { EsriLoaderService } from 'angular2-esri-loader';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {
  mapViewProperties: __esri.MapViewProperties = {
    center: [-112, 38],
    zoom: 5
  };
  mapProperties: __esri.MapProperties = {
    basemap: 'streets'
  }
  map: __esri.Map;
  mapView: __esri.MapView;

  mapImageLayer: __esri.MapImageLayerConstructor;
  tileLayer: __esri.TileLayerConstructor;
  featureLayer: __esri.FeatureLayerConstructor;
  unknownLayer: __esri.UnknownLayerConstructor;

  layersList = [
    {
      label: 'World Terrain Base',
      type: 'tile',
      config: {
        id: 'World_Terrain_Base',
        url: 'http://services.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer',
        visible: false
      }
    }
    ,
    {
      label: 'World Transportation',
      type: 'tile',
      config: {
        id: 'World_Transportation',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer'
      }
    }
    ,
    {
      label: 'Geology',
      type: 'mapImage',
      config: {
        id: 'Geology',
        url: 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/Energy/Geology/MapServer',
        opacity: 0.8
      }
    },
    {
      label: 'HSEC',
      type: 'feature',
      config: {
        id: 'HSEC',
        url: 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/Energy/HSEC/FeatureServer'
      }
    }
  ]

  constructor(private esriLoader: EsriLoaderService) { }

  ngOnInit() { }

  onMapInit(mapInfo: { map: __esri.Map, mapView: __esri.MapView }) {
    this.map = mapInfo.map;
    this.mapView = mapInfo.mapView;

    this.loadLayers();
  }

  addLayer(layerProperty: any) {
    let layer: any;
    switch (layerProperty.type) {
      case 'mapImage':
        layer = new this.mapImageLayer(layerProperty.config);
        break;
      case 'tile':
        layer = new this.tileLayer(layerProperty.config);
        break;
      case 'feature':
        layer = new this.featureLayer(layerProperty.config);
        break;
    }
    this.map.add(layer);
  }

  loadLayers() {
    this.esriLoader.loadModules([
      'esri/layers/MapImageLayer',
      'esri/layers/TileLayer',
      'esri/layers/FeatureLayer'
    ]).then(([
      MapImageLayer,
      TileLayer,
      FeatureLayer
    ]) => {
      this.mapImageLayer = MapImageLayer;
      this.tileLayer = TileLayer;
      this.featureLayer = FeatureLayer;

      this.layersList.forEach(layer => {
        this.addLayer(layer)
      });
    });
  }
}
