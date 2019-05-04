import { Injectable, OnDestroy } from '@angular/core';
import { BuildType } from './model/build-type';
import { BuildInfo } from './model/build-info';
import { Build } from './model/build';
import { Change } from './model/change';
import { BuildDataService } from './build-data.service';
import { BehaviorSubject, interval } from 'rxjs';
import { SubSink } from 'subsink';

@Injectable({
  providedIn: 'root'
})
export class BuildStoreService implements OnDestroy {

  private readonly hiddenBuildKey = 'hiddenBuilds';
  public hiddenBuildIds$ = new BehaviorSubject<string[]>([]);
  public builds$ = new BehaviorSubject<BuildInfo[]>([]);
  public filteredBuilds$ = new BehaviorSubject<BuildInfo[]>([]);
  private interval = 60000;
  private subsink = new SubSink();

  constructor(private buildDataService: BuildDataService) {
    this.loadHiddenBuilds();
    this.fetchNowAndOnIterval();
  }

  ngOnDestroy() {
    this.subsink.unsubscribe();
  }

  private updtateHiddenbuilds(builds: string[]) {
    localStorage.setItem(this.hiddenBuildKey, JSON.stringify(builds));
    this.hiddenBuildIds$.next(builds);
    const filteredList = this.builds$.value.filter(item => !builds.includes(item.id));
    this.filteredBuilds$.next(filteredList);
  }

  private fetchNowAndOnIterval(): void {
    this.fetchLatestBuilds();
    this.subsink.sink = interval(this.interval)
      .subscribe(() => this.fetchLatestBuilds());
  }

  private fetchLatestBuilds(): void {
    this.buildDataService.getLatestBuilds()
      .toPromise()
      .then(response => {
        const infolist = this.mapAndSortList(response.buildType);
        this.builds$.next(infolist);
        const hiddenIdList = this.hiddenBuildIds$.value;
        const filteredList = infolist.filter(item => !hiddenIdList.includes(item.id));
        this.filteredBuilds$.next(filteredList);
      });
  }

  private mapAndSortList(serverList: BuildType[]): BuildInfo[] {
    const infolist = serverList
      .map(item => this.buildTypeToBuildInfo(item))
      .sort(this.sort);
    return infolist;
  }

  private getStoredHiddenBuildList(): string[] {
    const stringedItems = localStorage.getItem(this.hiddenBuildKey);
    if (!stringedItems) {
      return [];
    }
    const hiddenBuilds: string[] = JSON.parse(stringedItems);
    return hiddenBuilds;
  }

  private loadHiddenBuilds(): void {
    const buildsToHide = this.getStoredHiddenBuildList();
    this.hiddenBuildIds$.next(buildsToHide);
  }

  toggleBuildVisibility(id: string): void {
    let hidden = this.getStoredHiddenBuildList();
    if (hidden.includes(id)) {
      hidden = hidden.filter(item => item !== id);
    } else {
      hidden.push(id);
    }
    this.updtateHiddenbuilds(hidden);
  }

  sort(a: BuildInfo, b: BuildInfo) { return a.id.localeCompare(b.id); }

  buildTypeToBuildInfo(deepBuild: BuildType): BuildInfo {
    const build = deepBuild.builds.build.length ? deepBuild.builds.build[0] : new Build();
    const change = build && build.lastChanges && build.lastChanges.change.length ? build.lastChanges.change[0] : new Change();
    const { id, name } = deepBuild;
    const { number, status, statusText, branchName } = build;
    const { username, date, comment, version: commit } = change;

    const flatbuild: BuildInfo = {
      id,
      name,
      number,
      status,
      statusText,
      branchName: branchName ? branchName : '',
      username,
      date,
      comment,
      commit,
    };
    return flatbuild;
  }
}